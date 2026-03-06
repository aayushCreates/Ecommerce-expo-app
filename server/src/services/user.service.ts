import { User } from "../models/user.model";

interface AddressType {
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

export class UserServices {
  static async getAddressService(user: any) {
    return user.addresses;
  }

  static async addAddressService(user: any, body: AddressType) {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = body;

    if (!fullName || !streetAddress || !city || !state || !zipCode) {
      throw new Error("Missing required address fields");
    }

    if (isDefault) {
      user.addresses.forEach((addr: AddressType) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault: isDefault || false,
    });

    await user.save();

    return user.addresses;
  }

  static async updateAddressService(user: any, addressId: string, body: any) {
    const address = user.addresses.id(addressId);

    if (!address) {
      throw new Error("Address not found");
    }

    if (body.isDefault) {
      user.addresses.forEach((addr: AddressType) => {
        addr.isDefault = false;
      });
    }

    address.label = body.label || address.label;
    address.fullName = body.fullName || address.fullName;
    address.streetAddress = body.streetAddress || address.streetAddress;
    address.city = body.city || address.city;
    address.state = body.state || address.state;
    address.zipCode = body.zipCode || address.zipCode;
    address.phoneNumber = body.phoneNumber || address.phoneNumber;
    address.isDefault =
      body.isDefault !== undefined ? body.isDefault : address.isDefault;

    await user.save();

    return user.addresses;
  }

  static async deleteAddressService(user: any, addressId: string) {
    user.addresses.pull(addressId);
    await user.save();

    return user.addresses;
  }

  static async getWishlistService(userId: string) {
    const user = await User.findById(userId).populate("wishlist");
    return user?.wishlist;
  }

  static async addToWishlistService(user: any, productId: string) {
    if (user.wishlist.includes(productId)) {
      throw new Error("Product already in wishlist");
    }

    user.wishlist.push(productId);
    await user.save();

    return user.wishlist;
  }

  static async removeFromWishlistService(user: any, productId: string) {
    if (!user.wishlist.includes(productId)) {
      throw new Error("Product not found in wishlist");
    }

    user.wishlist.pull(productId);
    await user.save();

    return user.wishlist;
  }
}
