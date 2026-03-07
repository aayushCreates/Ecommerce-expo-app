import { Router } from "express";
import { createProduct, deleteProduct, getAllCustomers, getAllOrders, getAllProducts, getDashboardStats, updateOrderStatus, updateProduct } from "../controllers/admin.controller";
import { upload } from "../middlewares/multer.middleware";

const adminRoutes = Router();

adminRoutes.post("/products", upload.array("images", 3), createProduct);
adminRoutes.get("/products", getAllProducts);
adminRoutes.put("/products/:id", upload.array("images", 3), updateProduct);
adminRoutes.delete("/products/:id", deleteProduct);

adminRoutes.get("/orders", getAllOrders);
adminRoutes.patch("/orders/:orderId/status", updateOrderStatus);

adminRoutes.get("/customers", getAllCustomers);

adminRoutes.get("/stats", getDashboardStats);


export default adminRoutes;