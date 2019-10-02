const mongoose = require('mongoose');
const {Schema } = mongoose;

const ProfileSchema = new Schema({
   user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'user'
   },
   company : String,
   location: String,
   status: {
     type: String,
     required: true
   },
   skills: {
     type: [String],
     required: true
   },
   bio: String,
   gitHubUsername: String,
   experience: [
   {
     title: {
     type: String,
     required: true
   },
   company: {
     type: String,
     required: true
   },

   location: String,
   from: {
     type:Date,
     required: true
   },
   to: Date,
   current: {
     type: Boolean,
     default: false
   },
    description: String
  }
],

  education: [
    {
    school: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    fieldofstudy: {
      type: String,
      required: true
    },
    from: {
      type: Date,
      required: true
    },
     to: Date,
     current: {
       type: Boolean,
       default: false
     },
     description: String
  }
],
social: {
  twitter: String,
  facebook: String,
  linkedin: String,
  instagram: String
},

date: {
  type: Date,
  default: Date.now
}

})

module.exports = mongoose.model('profile', ProfileSchema);
