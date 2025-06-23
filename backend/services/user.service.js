import { hash } from 'bcrypt';
import User from  '../models/user.modal.js'

export const createUser = async ({email,password}) => {
    
    if(!email || !password){
        throw new Error("please fill up the credentials");
    }

    //  method in a model 
    const hashPassword = await User.hashPassword(password);

    const user = await User.create({

        email:email,
        password:hashPassword,

    })

    return user;
}
export const get_all_user = async ({user_id})=>{
    const all_user = await User.find({
        _id : {$ne : user_id}
    });
    return all_user;
}
