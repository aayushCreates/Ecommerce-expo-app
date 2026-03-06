import { Request, Response } from "express";
import { UserServices } from "../services/user.service";

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const data = await UserServices.getAddressService(user);

    res.status(200).json({
      success: true,
      message: "User address fetched successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const addAddress = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const userInput = req.body;
    const data = await UserServices.addAddressService(user, userInput);

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.addressId as string;
    const userInput = req.body;

    const data = await UserServices.updateAddressService(user, id, userInput);

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.addressId as string;

    const data = await UserServices.deleteAddressService(user, id);

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const data = await UserServices.getWishlistService(user._id);

    res.status(200).json({
      success: true,
      message: "User wishlist fetched successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const userInput = req.body;
    const data = await UserServices.addToWishlistService(
      user,
      userInput.productId
    );

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.productId as string;
    const data = await UserServices.removeFromWishlistService(user, id);

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
