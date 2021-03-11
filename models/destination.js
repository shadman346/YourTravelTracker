const mongoose = require('mongoose');
const {formatDistanceToNow} = require('date-fns')

const DestinationSchema = new mongoose.Schema({
   title: {
      type: String,
   },
   images: [
      {
         type: String,
      },
   ],
   expenditure: {
      type: Number,
   },
   location: {
      type: String,
   },
   experience: {
      type: String,
   },
   isVisited: {
      type: Boolean,
      required: true,
   },
   date: {
       type: Date,
       default: new Date(),
   }
});

DestinationSchema.virtual('modify').get(function(){
    return formatDistanceToNow(this.date,{addSuffix: true,includeSeconds: true})
})
module.exports = mongoose.model('destination', DestinationSchema);
