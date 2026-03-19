import SafeScreen from "@/components/SafeScreen";
import useWishlist from "@/hooks/useWishlist";
import { Product } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const WishlistItemCard = ({
  item,
  onRemove,
  onAddToCart,
}: {
  item: Product;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
}) => {
  return (
    <View className="bg-white dark:bg-gray-900 rounded-3xl mb-4 overflow-hidden border border-gray-800 shadow-sm">
      <View className="flex-row p-4">
        <View className="relative">
          <Image
            source={{ uri: item.images[0] }}
            className="w-24 h-24 rounded-2xl bg-gray-800"
          />
          <TouchableOpacity 
            onPress={() => onRemove(item._id)}
            className="absolute -top-2 -left-2 bg-gray-800 p-1.5 rounded-full shadow-sm border border-gray-700"
          >
            <Ionicons name="close" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 ml-4 justify-between">
          <View>
            <Text className="text-white font-bold text-lg" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
              {item.category}
            </Text>
            <Text className="text-green-600 font-bold text-xl mt-1">
              ${item.price}
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => onAddToCart(item._id)}
            className="bg-blue-900/20 py-2 rounded-xl flex-row items-center justify-center border border-blue-900/30"
          >
            <Feather name="shopping-cart" size={16} color="#3b82f6" />
            <Text className="text-green-500 font-bold text-sm ml-2">Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const WishlistScreen = () => {
  const { wishlists, isLoading, toggleWishlist } = useWishlist();
  const router = useRouter();

  // We would also need useCart to add to cart from here
  // For now let's just implement the UI and basic removal

  if (isLoading) {
    return (
      <SafeScreen>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </SafeScreen>
    );
  }

  if (wishlists.length === 0) {
    return (
      <SafeScreen>
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-24 h-24 bg-red-900/20 rounded-full items-center justify-center mb-6">
            <Ionicons name="heart-outline" size={48} color="#ef4444" />
          </View>
          <Text className="text-2xl font-bold text-white mb-2 text-center">Your Wishlist is Empty</Text>
          <Text className="text-gray-400 text-center mb-8">
            Save items you love to find them easily later and keep track of price drops.
          </Text>
          <TouchableOpacity 
            onPress={() => router.push("/")}
            className="bg-green-500 w-full py-4 rounded-2xl items-center shadow-lg shadow-green-500/30"
          >
            <Text className="text-white font-bold text-lg">Explore Products</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View className="flex-1 bg-black">
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-white">Wishlist</Text>
          <Text className="text-gray-400 font-medium">{wishlists.length} items saved</Text>
        </View>

        <FlatList
          data={wishlists}
          renderItem={({ item }) => (
            <WishlistItemCard 
              item={item} 
              onRemove={(id) => toggleWishlist(id)}
              onAddToCart={(id) => {
                // In a real app, call addToCart from useCart hook
                console.log("Add to cart:", id);
              }}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeScreen>
  );
};

export default WishlistScreen;
