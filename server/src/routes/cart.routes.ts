import { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "../controllers/cart.controller";

const cartRoutes = Router();

cartRoutes.get("/", isUserLoggedIn, getCart);
cartRoutes.post("/", isUserLoggedIn, addToCart);
cartRoutes.put("/:productId", isUserLoggedIn, updateCartItem);
cartRoutes.delete("/:productId", isUserLoggedIn, removeFromCart);
cartRoutes.delete("/", isUserLoggedIn, clearCart);


export default cartRoutes;