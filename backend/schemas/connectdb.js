import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const ConnectDB = async() => {
    try {
        await mongoose.connect(process.env.URI);
        console.log("Connected to Database");
    } catch (error) {
        console.error(error);
    };
};
export default ConnectDB;

