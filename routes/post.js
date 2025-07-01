const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true,
  }, 
  image :{
       type : String ,
  },

 user :{
   type:mongoose.Schema.Types.ObjectId  ,
   ref:'User'          //yea humnay banaya post main user ki id dalnay kay liyae          
 },
   
  createdAt: {
    type: Date,
    default: Date.now, // Sets the default to the current date and time
  },
  likes: {
    type: [Number],
    default: [], // Initial number of likes is set to 0
  }
});

module.exports = mongoose.model('Post', postSchema);
