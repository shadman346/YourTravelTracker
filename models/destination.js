const mongoose = require('mongoose');
const {formatDistanceToNow} = require('date-fns')

const DestinationSchema = new mongoose.Schema({
   title: {
      type: String,
   },
   images: [
      {
         url: String,
         filename: String,
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
       default: Date.now(),
   }
});

DestinationSchema.virtual('modify').get(function(){
    return formatDistanceToNow(this.date,{addSuffix: true,includeSeconds: true})
})

DestinationSchema.post('findOneAndUpdate', async function(result){
     result.date= Date.now()
     await result.save()
     
})
module.exports = mongoose.model('destination', DestinationSchema);
