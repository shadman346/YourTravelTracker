const mongoose = require('mongoose');
const {formatDistanceToNow} = require('date-fns')

const ImageSchema=new mongoose.Schema({
      url: String,
      filename: String,
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_360,h_205,c_fill');
})
const DestinationSchema = new mongoose.Schema({
   title: {
      type: String,
   },
   images: [ImageSchema],

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
});

DestinationSchema.post('findOneAndUpdate', async function(result){
     result.date= Date.now()
     await result.save()
     
});

// DestinationSchema.post('save', async function(doc){
//     console.log(doc)
// })
module.exports = mongoose.model('destination', DestinationSchema);
