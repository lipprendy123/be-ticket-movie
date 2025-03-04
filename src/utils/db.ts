import mongoose from 'mongoose'
import dotenv from "dotenv";

dotenv.config();

export default function connectDB() {
    const DATABASE_URL = process.env.MONGODB_URI ?? ""

    try {
        mongoose.connect(DATABASE_URL)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }

    const dbConn = mongoose.connection

    dbConn.on('open', (_) => {
        console.log(`Database connected`);
    })

    dbConn.on('error', (err) => {
        console.log(`connection error : ${err}`);
    })
}