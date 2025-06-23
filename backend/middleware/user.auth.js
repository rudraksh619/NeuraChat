 import jwt from 'jsonwebtoken'
 import RedisClient from '../services/redis.service.js';
 import Redis from 'ioredis';
 export const checkauth = async (req,res,next) =>{ 
   try {
    const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('bearer ')) {
  return res.status(401).json({ error: 'Authorization token missing or invalid' });
}
    const token = ( req.headers.authorization.split(' ')[1]);
    if(!token)
    {
      return   res.status(400).send({error:"invalid credentials"});
    }
  const logout = await RedisClient.get(token);
  if(logout)
  { 
   res.cookie('token',' ');
   return res.status(400).send("Unoauthoeized User");
  }
    const user = jwt.verify(token,process.env.JWT_SECRET);
                                      
    req.user = user;
    next();
   } catch (error) {
      return res.status(500).json(error.message);
   }
}

