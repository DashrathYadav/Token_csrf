const mongoose=require('mongoose');
const {isEmail}=require('validator');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
   
    email:{
        
        type:String,
        required:true,
        unique:true,
        validate: [isEmail,"please Enter valid Email"]

    },
    password:{
        type:String,
        required:true,  
        minLength:[4,"Password  minimum lenght should be 4"]      
    }
});

userSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    console.log("New user is about to be created",this);
    next();
})


 const userModel= mongoose.model('user',userSchema);
 module.exports=userModel;

