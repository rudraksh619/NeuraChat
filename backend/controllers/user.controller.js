import { validationResult } from "express-validator";
import {createUser,get_all_user} from "../services/user.service.js";
import User from "../models/user.modal.js";
import { checkauth } from "../middleware/user.auth.js";
import RedisClient from "../services/redis.service.js";


export const createUserController = async (req, res) => {
  const err = validationResult(req);
  console.log("gfb");
  if (!err.isEmpty()) {
    return res.status(400).json({ err: err.array() });
  }

  try {
    console.log("dji");
    const user = await createUser(req.body);
    const token = await user.genratetoken();
    delete user._doc.password;
    return res.status(201).json({ user, token });
  } catch (error) {
    console.log("fgnh");
    console.log(error);
    res.status(400).send(error.message);
  }
};

export const userLogin = async (req, res) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    console.log("error during login");
    console.log(err.array());
    return res.status(400).json({ error: err.array() });
  }

  try {
    // genrtae token and comparePassword is not a static method they are instance method so thet are not
    // called by using Model

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).send("invalaid credentials");
    }
   const ismatch =  await user.comparePassword(password);
   if(!ismatch){
    return res.status(401).json({errors:"Invalid Credentials"});
   }
    const token = await user.genratetoken();
    delete user._doc.password;
    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(400).json({err:error.message});
  }
};


export const showProfile = async (req,res)=>{

    console.log(req.user);
    return res.status(200).json({
     user: req.user,
    });
}

export const logoutcontroller = async (req,res)=>{

  try {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    RedisClient.set(token,'logout','EX',60*60*24);

    return res.status(200).send("logout suucessfully");
  } catch (error) {

    return res.status(400).json({"err":error.message});
    
  }

}

export const get_all_User = async (req,res)=>{

  try {
    const logined_user = await User.findOne({email: req.user.email})
    const all_user = await get_all_user({user_id:logined_user._id});
    return res.status(200).json({all_user})
  } catch (error) {
    return res.status(400).json({err:error.message});
  }
  
}