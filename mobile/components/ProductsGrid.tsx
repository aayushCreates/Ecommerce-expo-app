import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
}

export default function ProductsGrid({
  products,
  isLoading,
  isError,
}: ProductGridProps) {
  const {
    toggleWishlist,
    addToWishlist,
    isProductInWishlist,
    isAddingToWishlist,
    isRemovingToWishlist,
  } = useWishlist();

  const { isAddingToCart, addToCart } = useCart();

  if (isLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size={"large"} color={"#666"} />
        <Text className="text-text-secondary mt-4">Loading products...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="py-20 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color={"#FF6B6B"} />
        <Text className="text-text-primary font-semibold mt-4">
          Failed to load products
        </Text>
        <Text className="text-text-secondary text-sm mt-2">
          Please check your connection and try again
        </Text>
      </View>
    );
  }

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      {
        productId,
        quantity: 1,
      },
      {
        onSuccess: () => {
          Alert.alert("Success", `${productName} added to cart`);
        },
        onError: (err: any) => {
          Alert.alert(
            "Error",
            err?.response?.data?.message || "Failed to add to cart"
          );
        },
      }
    );
  };

  const renderItem = ({ item: product }: { item: Product }) => {
    return (
      <TouchableOpacity
        className="bg-surface rounded-3xl overflow-hidden mb-3"
        style={{
          width: "48%",
        }}
        activeOpacity={0.8}
        // onPress={() => router.push(`/products/${product._id}`)}
      >
        <View className="relative">
          <Image
            resizeMode="cover"
            source={{
              uri: product.images[0],
            }}
            className="w-full h-44 bg-background-lighter"
          />

          <TouchableOpacity
            className="absolute top-3 right-3 bg-black/30 backdrop-blur-xl p-2 rounded-full"
            activeOpacity={0.7}
            onPress={() => toggleWishlist(product._id)}
            disabled={isAddingToWishlist || isRemovingToWishlist}
          >
            {isAddingToWishlist || isRemovingToWishlist ? (
              <ActivityIndicator size={"small"} color={"#FFFFFF"} />
            ) : (
              <Ionicons
                name={
                  isProductInWishlist(product._id) ? "heart" : "heart-outline"
                }
                size={18}
                color={isProductInWishlist(product._id) ? "#FF6B6B" : "#FFFFFF"}
              />
            )}
          </TouchableOpacity>
        </View>

        <View className="p-3">
          <Text className="text-text-secondary text-xs mb-1">
            {product.category}
          </Text>
          <Text className="text-text-primary font-bold text-sm mb-2">
            {product.name}
          </Text>

          <View className="flex-row items-center mb-3">
            <Ionicons name="star" size={12} color={"#FFC107"} />
            <Text className="text-text-primary text-xs font-semibold ml-1">
              {product.averageRating.toFixed(1)}
            </Text>
            <Text className="text-text-secondary text-xs ml-1">
              ({product.totalReviews})
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-primary font-bold text-lg">
              ${product.price.toFixed(2)}
            </Text>
            <TouchableOpacity
              className="bg-primary rounded-full w-8 h-8 items-center justify-center"
              activeOpacity={0.7}
              onPress={() => handleAddToCart(product._id, product.name)}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <ActivityIndicator size={"small"} color={"#121212"} />
              ) : (
                <Ionicons color={"#121212"} name="add" size={18} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      ListEmptyComponent={NoProductsFound}
      columnWrapperStyle={{
        justifyContent: "space-between",
      }}
    />
  );
}

function NoProductsFound() {
  return (
    <View className="py-20 items-center justify-center">
      <Ionicons name="search-outline" size={48} color={"#666"} />
      <Text className="text-text-primary font-semibold mt-4">
        No Products Found
      </Text>
      <Text className="text-text-primary text-sm mt-2">
        Try adjusting your filters
      </Text>
    </View>
  );
}
