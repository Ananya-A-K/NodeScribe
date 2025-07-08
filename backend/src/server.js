import express from "express"; 
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import path from "path";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();
//console.log(process.env.MONGO_URI);

const app=express();    //creates an object
const PORT=process.env.PORT || 5001; // default 5001, if port undefined
const __dirname = path.resolve(); //get the current directory path or source directry for backend


//middleware order of middleware matters
//DEV ENVIRONMENT
//CORS for development
if(process.env.NODE_ENV !== "production"){
    app.use(cors({
        origin: "http://localhost:5173",
    }));
}

app.use(express.json()); //middleware to parse or access the data in the request body as a json data
app.use(rateLimiter);


//custom middleware
// app.use((req,res,next)=>{
//     console.log(`Request method is ${req.method} and request url is ${req.url}`);
//     next(); //triggers the next function - here, "getNotes" funct in notesRoutes.js
// })

app.use("/api/notes",authMiddleware, notesRoutes);
//PRODUCTION PART
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist"))) //optimised react application after taking care that CORS errors are unlikely during deployment

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend","dist", "index.html"));
    });
}

//connect to db and then listen or application starts.. if connection to db fails, there's no point in starting the server
connectDB().then(()=>{
    app.listen(PORT,()=>{   //listens at pno 5001 and prints a log
        console.log("Server at pno:", PORT);
    });
});




