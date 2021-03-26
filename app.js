if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const { colordb } = require('./color');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const helmet = require('helmet');
const {helmetPolicy} = require('./helmetPolicy')

const session = require('express-session');
const MongoStore = require('connect-mongo')
const mongoSanitize = require('express-mongo-sanitize')


const destinationRoutes = require('./routes/destination');
const userRoutes = require('./routes/user');

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl,{
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
        dbUrl
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

const store = new MongoStore({
    mongoUrl: dbUrl,
    secret:'thatismysecondsecret',
    touchAfter: 24*60*60
});

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    name:'session',
   secret: 'thatismysecret',
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7 + 6,
   },
   store:store,
};


app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

app.use(helmet.contentSecurityPolicy(helmetPolicy));
// sanitize any valuse that has $-dollar sign or similar which can affect mongo querry
app.use(mongoSanitize({
    replaceWith: '_'
}))

app.use((req, res, next) => {
   if (req.session.User) res.locals.userName = req.session.User;
   if (req.query.isVisited == 'false') {
      res.locals.isVisited = 'false';
   } else res.locals.isVisited = 'true';

   res.locals.success=req.flash('success');
   res.locals.error=req.flash('error');
   
   res.locals.AddDestination = req.url;
   next();
});


//routes========================================================
app.use('/destination',destinationRoutes)
app.use('/',userRoutes)

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
