import express from "express"; 
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

dotenv.config();
//console.log(process.env.MONGO_URI);

const app=express();    //creates an object
const PORT=process.env.PORT || 5001; // default 5001, if port undefined


//middleware order of middleware matters
app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(express.json()); //middleware to parse or access the data in the request body as a json data
app.use(rateLimiter);


//custom middleware
// app.use((req,res,next)=>{
//     console.log(`Request method is ${req.method} and request url is ${req.url}`);
//     next(); //triggers the next function - here, "getNotes" funct in notesRoutes.js
// })

app.use("/api/notes",notesRoutes);

//connect to db and then listen or application starts.. if connection to db fails, there's no point in starting the server
connectDB().then(()=>{
    app.listen(PORT,()=>{   //listens at pno 5001 and prints a log
        console.log("Server at pno:", PORT);
    });
});




