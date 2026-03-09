import cloudinary from "../config/cloudinary.config";
import { Product } from "../models/product.model";
import { Order, OrderStatus } from "../models/order.model";
import { User } from "../models/user.model";

export class AdminServices {
  static async allProductsService() {
    return await Product.find().sort({ createdAt: -1 });
  }

  static async createProductService(body: any, files: any) {
    const { name, description, price, stock, category } = body;

    if (!name || !description || !price || !stock || !category) {
      throw new Error("All fields are required");
    }

    if (!files || files.length === 0) {
      throw new Error("At least one image is required");
    }

    if (files.length > 3) {
      throw new Error("Maximum 3 images allowed");
    }

    const uploadPromises = files.map((file: any) =>
      cloudinary.uploader.upload(file.path, { folder: "products" })
    );

    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults.map((result) => result.secure_url);

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls,  
    });

    return product;
  }

  static async updateProductService(id: string, body: any, files: any) {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    const { name, description, price, stock, category } = body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (category) product.category = category;

    if (files && files.length > 0) {
      if (files.length > 3) {
        throw new Error("Maximum 3 images allowed");
      }

      const uploadPromises = files.map((file: any) =>
        cloudinary.uploader.upload(file.path, { folder: "products" })
      );

      const uploadResults = await Promise.all(uploadPromises);

      product.images = uploadResults.map((result) => result.secure_url);
    }

    await product.save();

    return product;
  }

  static async allOrdersService() {
    return await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
  }

  static async updateOrderStatusService(orderId: string, status: string) {
    if (!["pending", "shipped", "delivered"].includes(status)) {
      throw new Error("Invalid status");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status.toUpperCase() as OrderStatus;

    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }

    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    return order;
  }

  static async allCustomersService() {
    return await User.find().sort({ createdAt: -1 });
  }

  static async dashboardStatsService() {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
    };
  }

  static async deleteProductService(id: string) {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.images?.length) {
      const deletePromises = product.images.map((imageUrl) => {
        const publicId =
          "products/" + imageUrl.split("/products/")[1]?.split(".")[0];

        if (publicId) {
          return cloudinary.uploader.destroy(publicId);
        }
      });

      await Promise.all(deletePromises.filter(Boolean));
    }

    await Product.findByIdAndDelete(id);
  }
}
