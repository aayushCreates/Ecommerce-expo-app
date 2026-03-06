import { Request, Response } from "express";
import { ProductServices } from "../services/product.service.js";

export async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await ProductServices.getAllProducts();

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params as {
      id: string;
    };
    const product = await ProductServices.getProductById(id);

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error: any) {
    res.status(error.message === "Product not found" ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
}
