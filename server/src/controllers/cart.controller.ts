import { Request, Response } from "express";
import { CartServices } from "../services/cart.service";

export async function getCart(req: Request, res: Response) {
  try {
    const cart = await CartServices.getOrCreateCart(req.user);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error in getCart:", error);

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

export async function addToCart(req: Request, res: Response) {
  try {
    const { productId, quantity = 1 } = req.body;

    const cart = await CartServices.addItemToCart(
      req.user,
      productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error: any) {
    console.error("Error in addToCart:", error);

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

export async function updateCartItem(req: Request, res: Response) {
  try {
    const { productId } = req.params as {
        productId: string
    };;
    const { quantity } = req.body;

    const cart = await CartServices.updateCartItem(
      req.user,
      productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error: any) {
    console.error("Error in updateCartItem:", error);

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

export async function removeFromCart(req: Request, res: Response) {
  try {
    const { productId } = req.params as {
        productId: string
    };

    const cart = await CartServices.removeItemFromCart(
      req.user,
      productId
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error: any) {
    console.error("Error in removeFromCart:", error);

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

export async function clearCart(req: Request, res: Response) {
  try {
    const cart = await CartServices.clearCart(req.user);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error: any) {
    console.error("Error in clearCart:", error);

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}