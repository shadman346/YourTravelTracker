const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Destination = require('../models/destination');
const { colordb } = require('../color');
const User = require('../models/User');
const { getMaxListeners } = require('../models/destination');
const { indianLoc } = require('./indiaSeed');
const dbUrl = 'your-travel-tracker';

mongoose.connect(`mongodb://localhost:27017/${dbUrl}`, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
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


// async function arr() {
//       let arr_id = await Destination.find({}, { _id: 1 });
//       arr_id = arr_id.map((el) => `${el._id}`);
    //   console.log(await User.findOneAndUpdate({name: 'Shadman Ansari'},{ $set: { destination: [] }}));
    //   const user1=await User.findOneAndUpdate({},{$push: {destination:arr_id}},{new:true});
    //   console.log(user1)
      
    //   const user1 = new User({
    //      name: 'Shadman Ansari',
    //      email: 'shadmanansari346c@gmail.com',
    //      password: 'qwerty123',
    //   });
     
//   const show = await User.findOne().populate('destination');
//    console.log(show);
// }

// arr();

// mongoose
//   .connect("mongodb://localhost:27017/your-travel-tracker", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MONGO connection open!!");
//   })
//   .catch((err) => {
//     console.log("OH!! no Mongo connection error!!");
//     console.log(err);
//   });

// const imgLocalAddress = [
//    '/images/194-1942138_anime-girl-sunset-wallpaper-red-anime-scenery.jpg',
//    '/images/1096909.jpg',
//    '/images/1096963.jpg',
//    '/images/1096974.png',
//    '/images/beautiful-reflection-wallpaper-1920x1080-wallpaper.jpg',
//    '/images/eUN6MF1.jpg',
//    '/images/wp1937331.jpg',
//    '/images/wp2436025.jpg',
//    '/images/wp2436047-violet-evergarden-wallpapers.jpg',
//    '/images/wp4091780.jpg',
//    '/images/wp5620727-stars-anime-hd-wallpapers.jpg',
// ];

function sample(array) {
   return array[Math.floor(Math.random() * array.length)];
}
// async function seedDb() {
//     const user = await User.findOne({name:"shadman ansari"})
// //    await Destination.deleteMany({});
//    for (let i = 0; i < 250; i++) {
//       const rs = Math.floor(Math.random() * 10000);
//       const dest = new Destination({
//          title: `${sample(descriptors)} ${sample(places)}`,
//          expenditure: rs,
//          isVisited: rs % 2 ? true : false,
//          location: `${indianLoc[rs % 200].name}, ${indianLoc[rs % 200].state}`,
//          geometry: {
//              type:"Point",
//              coordinates:[indianLoc[rs % 200].lon,indianLoc[rs % 200].lat]
//          },
//          experience:
//             "Lorem ne deserunt!Quibusdam dolores vero perferendis laudantium.",
//          date: new Date(),
//       });
//     user.destination.push(dest._id)
      
//       await dest.save();
//    }
//    console.log(user)
//    await user.save();
// }

// seedDb().then(() => {
//    db.close(function () {
//       console.log(
//          colordb.termination(
//             "Mongoose default connection is disconnected due to closing mongoDb connection"
//          )
//       );
//    });
// });
