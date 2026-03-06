import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config";
import cors from 'cors';
import morgan from 'morgan';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));




const port = process.env.PORT;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on the PORT: " + port + " 🚀🚀🚀");
    });
  })
  .catch((err) => {
    console.log("ERROR: " + err);
  });
