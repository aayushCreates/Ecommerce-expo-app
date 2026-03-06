import { Product } from "../models/product.model.js";

export class ProductServices {
  static async getProductById(productId: string) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  static async getAllProducts() {
    return await Product.find();
  }
}
