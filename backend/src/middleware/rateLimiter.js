import ratelimit from "../config/upstash.js";

const rateLimiter=async (req,res,next)=>{
    try{
        const {success}=await ratelimit.limit("my-rate-limit"); //rate limiting per user use userid or ip address
        if(!success){
            return res.status(429).json({message:"Too many requests, please try again later.",})
        }
        next();
    }
    catch(error){
        console.log("Rate milit error", error);
        next(error);
    }
};

export default rateLimiter;