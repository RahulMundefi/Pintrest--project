const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");
 
mongoose.connect("mongodb://127.0.0.1:27017/nayaappforgolus");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Post'
    } 
  ],
  dp: {
    type: String, // URL or path to the display picture
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  }
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);
