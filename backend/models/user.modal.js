import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength : [6,'email must bw atleast a length of 6'],
        maxLength : [50,'email must not be greater then the length of 50'],
        
    },
    password:{

        type:String,
        select:false,
    }
})

// / hasing the password 

 UserSchema.statics.hashPassword = async function (password){

  return await bcrypt.hash(password,10);

 }

 UserSchema.methods.comparePassword = async function (userPassword)
 {
    return await bcrypt.compare(userPassword,this.password);
 }

UserSchema.methods.genratetoken = function (){
   return jwt.sign({
        email:this.email,
    },process.env.JWT_SECRET,{expiresIn:'24h'})
}



const User = mongoose.model('User',UserSchema);

export default User;

