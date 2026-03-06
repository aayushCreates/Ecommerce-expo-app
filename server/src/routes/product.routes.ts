import { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import { getAllProducts, getProductById } from "../controllers/product.controller";

const productRoutes = Router();

productRoutes.get("/", isUserLoggedIn, getAllProducts);
productRoutes.get("/:id", isUserLoggedIn, getProductById);

export default productRoutes;