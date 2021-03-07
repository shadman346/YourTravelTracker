const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const { colordb } = require('./color');
const Destination = require('./models/destination');
const flash = require('connect-flash');
const { destinationSchema } = require('./Schema');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

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

app.use(flash());

//middleware user-defined ==================================================
app.use((req, res, next) => {
   if (req.query.isVisited == 'true' || req.query.isVisited == 'false') {
      res.locals.isVisited = req.query.isVisited;
   } else {
      res.locals.isVisited = 'temp';
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
app.get(
   '/destination',
   wrapAsync(async (req, res) => {
      let { isVisited = 'true' } = req.query;
      if (isVisited == 'true' || isVisited == 'false') {
         isVisited = isVisited == 'true';
      }
      const destinations = await Destination.find({ isVisited });
      if (isVisited) res.render('visited.ejs', { destinations });
      if (!isVisited) res.render('notvisited.ejs', { destinations });
   })
);

app.get(
   '/destination/AddDestination',
   wrapAsync(async (req, res) => {
      res.render('AddDestination.ejs', {});
   })
);

app.get(
   '/destination/:id',
   wrapAsync(async (req, res) => {
      const { id } = req.params;
      const destination = await Destination.findById(id);
      res.render('show.ejs', { destination });
   })
);
//+++++++++++++++++++++++++++++++
app.post(
   '/destination',
   wrapAsync(async (req, res) => {
      let { isVisited = '' } = req.query;
      if (isVisited == 'true' || isVisited == 'false') {
         isVisited = isVisited == 'true';
      }
      console.log(req.body.destination);
      const { error } = destinationSchema.validate(req.body);
      if (error) {
         const msg = error.details.map((el) => el.message).join(',');
         throw new ExpressError(msg);
      }
      const destination = new Destination(req.body.destination);
      console.log(req.body.destination.imgUrl);
      destination.images[0] = req.body.destination.imgUrl;
      destination.isVisited = isVisited;
      await destination.save();
      res.redirect(`/destination/${destination._id}?isVisited=${isVisited}`);
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
   res.status(statusCode).render('error.ejs', { err });
});

//server portttttt

app.listen(3000, () => {
   console.log('Serving on port 3000');
});
