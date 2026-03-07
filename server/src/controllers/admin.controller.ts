import { Request, Response, NextFunction } from "express";
import { AdminServices } from "../services/admin.service";

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await AdminServices.allProductsService();

    res.status(200).json({
      success: true,
      message: "All products fetched successfully",
      data: products,
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await AdminServices.createProductService(
      req.body,
      req.files
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
    console.error("Error creating product:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as {
        id: string
    };

    const product = await AdminServices.updateProductService(
      id,
      req.body,
      req.files
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await AdminServices.allOrdersService();

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params as {
        orderId: string
    };
    const { status } = req.body;

    const order = await AdminServices.updateOrderStatusService(
      orderId,
      status
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error: any) {
    console.error("Error updating order status:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await AdminServices.allCustomersService();

    res.status(200).json({
      success: true,
      message: "All customers fetched successfully",
      data: customers,
    });
  } catch (error: any) {
    console.error("Error fetching customers:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await AdminServices.dashboardStatsService();

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: stats,
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as {
        id: string
    };

    await AdminServices.deleteProductService(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};