import { Request, Response, NextFunction } from "express";
import { OrderServices } from "../services/order.service";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await OrderServices.createOrderService(req.user, req.body);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderServices.getUserOrdersService(req.user.clerkId);

    res.status(200).json({
      success: true,
      message: "User orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
