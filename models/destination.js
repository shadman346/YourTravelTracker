const mongoose = require('mongoose');
const {formatDistanceToNow} = require('date-fns')

const opts = { toJSON: { virtuals: true } };

const ImageSchema=new mongoose.Schema({
      url: String,
      filename: String,
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_360,h_205,c_limit');
})

ImageSchema.virtual('thumbnail_climit').get(function(){
    return this.url.replace('/upload','/upload/w_400,h_205,c_limit');
})
const DestinationSchema = new mongoose.Schema({
   title: {
      type: String,
   },
   images: [ImageSchema],

   location: {
      type: String,
   },
   geometry: {
        type: {
        type: String,
        enum: ['Point'],
        required: true
        },
        coordinates: {
        type: [Number],
        required: true
        }
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
},opts);

DestinationSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/destination/${this._id}">${this.title}</a><strong><br>
    <strong>${this.location}</strong>`
})

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
