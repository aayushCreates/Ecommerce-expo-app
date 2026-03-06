import { Router } from "express";
import { addAddress, addToWishlist, deleteAddress, getAddresses, getWishlist, removeFromWishlist, updateAddress } from "../controllers/user.controller";
import { isUserLoggedIn } from "../middlewares/auth.middleware";

const userRoutes = Router();

userRoutes.post("/addresses", isUserLoggedIn, addAddress);
userRoutes.get("/addresses", isUserLoggedIn, getAddresses);
userRoutes.put("/addresses/:addressId", isUserLoggedIn, updateAddress);
userRoutes.delete("/addresses/:addressId", isUserLoggedIn, deleteAddress);

// wishlist routes
userRoutes.post("/wishlist", isUserLoggedIn, addToWishlist);
userRoutes.delete("/wishlist/:productId", isUserLoggedIn, removeFromWishlist);
userRoutes.get("/wishlist", isUserLoggedIn, getWishlist);


export default userRoutes;