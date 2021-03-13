const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const { colordb } = require('./color');
const Destination = require('./models/destination');
const User = require('./models/User');
const flash = require('connect-flash');
const { destinationSchema, reviewSchema, registerSchema, loginSchema } = require('./Schema');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const {formatDistanceToNow} = require('date-fns');
const bcrypt = require('bcrypt');

const dbUrl = 'your-travel-tracker';

mongoose.connect(`mongodb://localhost:27017/${dbUrl}`, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
});

const db = mongoose.connection;
//db.once("state",func)  once used when you want to do certian action only one time no matter how time that certain event triggers
db.on('connected', function () {
   console.log(
      colordb.connected(
         'Mongoose default connection is open to ',
         'your-travel-tracker'
      )
   );
});

db.on('error', function (err) {
   console.log(
      colordb.error('Mongoose default connection has occured ' + err + ' error')
   );
});

db.on('disconnected', function () {
   console.log(
      colordb.disconnected('Mongoose default connection is disconnected')
   );
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware defined
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//=======

const sessionConfig = {
   secret: 'thatismysecret',
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7 + 6,
   },
};

app.use(session(sessionConfig));
app.use(flash());

//middleware user-defined ==================================================
const isLogin = (req, res, next) => {
    req.session.User='Shadman Ansari';

   if (req.session.User) next();
   else throw new ExpressError('permission denied', 400);
};

app.use((req, res, next) => {
   if (req.session.User) UserName = req.session.User;
   if (req.query.isVisited == 'true' || req.query.isVisited == 'false') {
      res.locals.isVisited = req.query.isVisited;
   } else {
      res.locals.isVisited = 'true';
   }
   res.locals.AddDestination = req.url;
   next();
});

//error wrapping function

function wrapAsync(foo) {
   return (req, res, next) => {
      foo(req, res, next).catch((err) => next(err));
   };
}

//routes========================================================

//+++++++++++++++++++++++++++++++++
app.get('/destination',isLogin,wrapAsync(async (req, res) => {
      let { isVisited = '' } = req.query;
      if (isVisited == 'true' || isVisited == 'false') {
         isVisited = isVisited == 'true';
      }else res.redirect('/destination?isVisited=true');

      const data=await User.findOne({ name: req.session.User }).populate('destination');

      if (isVisited) {
          const destinations=data.destination.filter(el=>el.isVisited===true)
          res.render('visited.ejs', { destinations });
        }
      if (!isVisited) {
          const destinations=data.destination.filter(el=>el.isVisited===false)
          res.render('notvisited.ejs', { destinations });
        }
   })
);

app.get('/destination/AddDestination',isLogin,wrapAsync(async (req, res) => {
      res.render('AddDestination.ejs', {});
   })
);

app.get('/destination/:id',isLogin,wrapAsync(async (req, res) => {
      const { id } = req.params;
      const destination = await Destination.findById(id);
      res.render('show.ejs', { destination });
   })
);


//=====+++++++++======
app.delete('/destination/:id',isLogin,wrapAsync(async (req,res)=>{
    const {id} = req.params;
    let {isVisited=''}=req.query;
    if (isVisited == 'false') isVisited = false;
    else isVisited=true;

    await User.findOneAndUpdate({name: req.session.User},{$pull: {destination:{_id:id}}});
    await Destination.findByIdAndDelete(id);
    res.redirect(`/destination?isVisited=${isVisited}`);
}))


app.put('/destination/:id/textarea',isLogin,wrapAsync(async (req,res)=>{
    const {id} = req.params;
    let {isVisited=''}=req.query;
    if (isVisited == 'false') isVisited = false;
    else isVisited=true;

    const { error } = reviewSchema.validate(req.body);
      if (error) {
         const msg = error.details.map((el) => el.message).join(',');
         throw new ExpressError(msg);
      }
      
    const {textarea} = req.body.review;
    await Destination.findOneAndUpdate({_id:id},{experience:textarea},{new:true});
    res.redirect(`/destination/${id}?isVisited=${isVisited}`);
})) 
//+++++++++++++++++++++++++++++++
app.post('/destination',isLogin,wrapAsync(async (req, res) => {
      let { isVisited = '' } = req.query;

      if (isVisited == 'true' || isVisited == 'false') {
         isVisited = isVisited == 'true';
      }else res.redirect('/destination?isVisted=true');

      const { error } = destinationSchema.validate(req.body);
      if (error) {
         const msg = error.details.map((el) => el.message).join(',');
         throw new ExpressError(msg);
      }

      const destination = new Destination(req.body.destination);
      destination.images[0] = req.body.destination.imgUrl;
      destination.isVisited = isVisited;
      destination.date= new Date();
      await destination.save();

    //   const userUpdate=await User.findOne({ name: req.session.User });
    //   userUpdate.destination.push(destination._id);
    //   await userUpdate.save();
    //  both method work
      await User.findOneAndUpdate(
         {name: req.session.User },
         { $push: { destination: [destination._id] } },
         {new: true});

      res.redirect(`/destination/${destination._id}?isVisited=${isVisited}`);
   })
);
//++++++++

app.get('/register',wrapAsync(async (req,res)=>{
    res.render('users/register.ejs')
}))

app.post('/register',wrapAsync(async (req,res)=>{

    // redirect to main page of app
    console.log(req.body)
    console.dir(registerSchema.validate(req.body))
    const {error}= registerSchema.validate(req.body);
    if(error){
        const msg = error.details.map((el) => el.message).join(',');
         throw new ExpressError(msg);
    }

    hash_Password=await bcrypt.hash(req.body.register.password,12);
    const userNew= new User({
        name: req.body.register.username,
        email: req.body.register.email,
        password: hash_Password
    })
    await userNew.save();


    res.send(userNew);
    
}));
//=====================================================
app.get('/login',wrapAsync(async (req, res) => {
    //   req.session.User = 'Shadman Ansari';
    //   const data=await User.findOne({ name: req.session.User });
    //     console.log(data);

    //iif already login redirect to main page
    //if no let proceed to login page
      res.render('users/login.ejs');
   })
);
app.post('/login',wrapAsync(async (req, res) => {
   //validate the data
   //find with username oremail
   // compare hashpassword and inputpassword
   //if false return to login page
   // if success redirect to main page and change session details
    console.log(req.body)
    console.log(loginSchema.validate(req.body))
    const {error} = loginSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg);
    }
    const input = req.body.login.username_email;
    let user = "";
    if(input.indexOf("@")==-1) user = await User.findOne({name: input},{password:1});
    else user = await User.findOne({email: input},{password:1});
    console.log(user)

    res.send(await bcrypt.compare(req.body.login.password,user.password))
   })
);


app.get('/logout',wrapAsync(async (req, res) => {
      req.session.destroy();
      res.send(req.session);
   })
);

//===================================================================================
app.all('*', (req, res, next) => {
   next(new ExpressError('Page Not Found', 404));
});

//err middleware
app.use((err, req, res, next) => {
   const { statusCode = 500 } = err;
   if (!err.message) err.message = 'Oh No, Something Went Wrong!';
   res.status(statusCode).render('users/error.ejs', { err });
});

//server portttttt

app.listen(3000, () => {
   console.log('Serving on port 3000');
});
