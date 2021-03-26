const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
   },
   password: {
      type: String,
      required: true,
   },
   image: {
      type: String,
   },
   destination: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'destination',
      },
   ],
});
UserSchema.index({ name: 1 }, { unique: true});
UserSchema.index({ email: 1 }, { unique: true});


UserSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        if(error.keyPattern['email'])
        next(new Error('Email_Id already exists!!'));
        if(error.keyPattern['name'])
        next(new Error('Username already taken!!'));
    } else {
      next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);
