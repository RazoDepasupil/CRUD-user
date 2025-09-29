import express from 'express';
import dotenv from 'dotenv';
import ConnectDB from './schemas/connectdb.js';
import userRouter from './routes/router.js';
import session from 'express-session';
import cors from 'cors'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(session({
    secret:process.env.SECRET,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24,
    }
}));
app.use(userRouter)

app.listen(PORT,()=>{
    console.log(`Listening on localhost:${PORT}`);
    ConnectDB();
})