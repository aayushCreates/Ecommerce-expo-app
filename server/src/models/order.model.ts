import mongoose, { Document, Types } from "mongoose";

export interface OrderItemDocument extends Document {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddressDocument extends Document {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}

type PaymentResult = {
  id: string;
  status: string;
};

export enum OrderStatus {
  PENDING = "pending",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
}

export interface OrderDocument extends Document {
  user: Types.ObjectId;
  clerkId: string;
  orderItems: OrderItemDocument[];
  shippingAddress: ShippingAddressDocument;
  paymentResult: PaymentResult;
  totalPrice: number;
  status: OrderStatus;
  deliveredAt?: Date;
  shippedAt?: Date;
}

const orderItemSchema = new mongoose.Schema<OrderItemDocument>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
});

const shippingAddressSchema = new mongoose.Schema<ShippingAddressDocument>({
  fullName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clerkId: { type: String, required: true },
    orderItems: [orderItemSchema],

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentResult: {
      id: String,
      status: String,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    deliveredAt: Date,
    shippedAt: Date,
  },
  { timestamps: true }
);

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);
