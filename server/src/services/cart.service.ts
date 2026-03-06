import { Types } from "mongoose";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { UserDocument } from "../models/user.model.js";

export class CartServices {
  static async getOrCreateCart(user: UserDocument) {
    let cart = await Cart.findOne({
      clerkId: user.clerkId,
    }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }

    return cart;
  }

  static async addItemToCart(
    user: UserDocument,
    productId: string,
    quantity: number
  ) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    let cart = await Cart.findOne({
      clerkId: user.clerkId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        throw new Error("Insufficient stock");
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: new Types.ObjectId(productId),
        quantity,
      });
    }

    await cart.save();

    return cart;
  }

  static async updateCartItem(
    user: UserDocument,
    productId: string,
    quantity: number
  ) {
    const cart = await Cart.findOne({
      clerkId: user.clerkId,
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      throw new Error("Item not found in cart");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    item.quantity = quantity;

    await cart.save();

    return cart;
  }

  static async removeItemFromCart(user: UserDocument, productId: string) {
    const cart = await Cart.findOne({
      clerkId: user.clerkId,
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return cart;
  }

  static async clearCart(user: UserDocument) {
    const cart = await Cart.findOne({
      clerkId: user.clerkId,
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.items = [];

    await cart.save();

    return cart;
  }
}
