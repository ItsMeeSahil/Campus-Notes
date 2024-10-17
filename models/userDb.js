const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/practice');
const userSchema=mongoose.Schema({
    name:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true
    },
    password:
    {
        type:String,
        required:true
    }
});
const User=mongoose.model("User",userSchema);
module.exports=User;