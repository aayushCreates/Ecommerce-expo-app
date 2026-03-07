import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
import reviewRoutes from "./routes/review.routes";
import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import paymentRouter from "./routes/payment.routes";
import paymentRoutes from "./routes/payment.routes";
import { clerkMiddleware } from "@clerk/express";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(clerkMiddleware()); //  adds auth object under the req => req.auth

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

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
