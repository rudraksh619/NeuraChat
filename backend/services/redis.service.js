import Redis from 'ioredis'
import dotenv from 'dotenv';
dotenv.config();

const RedisClient = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD,
});

RedisClient.on('connect',()=>{
    console.log("reddis connexted successfully");
})

export default RedisClient; 