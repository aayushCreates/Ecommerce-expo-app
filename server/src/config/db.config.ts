import mongoose from "mongoose";

const connectDB = async ()=> {
    const url = process.env.MONGO_URI;
    if (!url) {
        console.error("❌ DATABASE_URI is not defined in environment variables");
        process.exit(1);
      }

    try {
        await mongoose.connect(url);
        console.log("DATABASE CONNECTED ✅✅✅");
    }catch(err) {
        console.error("❌❌❌ Failed to connect to MongoDB:", err);
        process.exit(1); 
    }
}

export default connectDB;