import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import { CartItem } from "@/types";
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

const CartItemRow = ({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) => {
  return (
    <View className="flex-row bg-gray-900 p-4 mb-3 rounded-2xl items-center border border-gray-800">
      <Image
        source={{ uri: item.product.images[0] }}
        className="w-20 h-20 rounded-xl bg-gray-800"
      />
      <View className="flex-1 ml-4">
        <Text className="text-gray-900 font-bold text-base" numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text className="text-green-500 font-bold text-lg mt-1">
          ${item.product.price}
        </Text>
        
        <View className="flex-row items-center mt-2">
          <View className="flex-row items-center bg-gray-800 rounded-full px-2 py-1">
            <TouchableOpacity 
              onPress={() => onUpdateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
              className="p-1"
            >
              <Feather name="minus" size={16} color="#4b5563" />
            </TouchableOpacity>
            <Text className="mx-3 font-bold text-gray-800 dark:text-gray-200">{item.quantity}</Text>
            <TouchableOpacity 
              onPress={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
              className="p-1"
            >
              <Feather name="plus" size={16} color="#4b5563" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={() => onRemove(item.product._id)}
        className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full"
      >
        <Feather name="trash-2" size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
};

const CartScreen = () => {
  const { cart, isLoading, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const subtotal = cart?.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0;
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <SafeScreen>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </SafeScreen>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <SafeScreen>
        <View className="flex-1 justify-center items-center px-6">
          <View className="w-24 h-24 bg-green-900/20 rounded-full items-center justify-center mb-6">
            <Ionicons name="cart-outline" size={48} color="#1cc46b" />
          </View>
          <Text className="text-2xl font-bold text-white mb-2 text-center">Your Cart is Empty</Text>
          <Text className="text-gray-400 text-center mb-8">
            Looks like you haven't added anything to your cart yet. Let's find something you'll love!
          </Text>
          <TouchableOpacity 
            onPress={() => router.push("/")}
            className="bg-green-500 w-full py-4 rounded-2xl items-center shadow-lg shadow-green-500/30"
          >
            <Text className="text-white font-bold text-lg">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View className="flex-1 bg-gray-50 dark:bg-black">
        <View className="px-6 pt-6 pb-2">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">My Cart</Text>
          <Text className="text-gray-500 dark:text-gray-400 font-medium">{cart.items.length} items</Text>
        </View>

        <FlatList
          data={cart.items}
          renderItem={({ item }) => (
            <CartItemRow 
              item={item} 
              onUpdateQuantity={(id, qty) => updateQuantity({ productId: id, quantity: qty })}
              onRemove={(id) => removeFromCart(id)}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 220 }}
          showsVerticalScrollIndicator={false}
        />

        <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-6 border-t border-gray-100 dark:border-gray-800 rounded-t-3xl shadow-xl">
          <View className="space-y-3 mb-6">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500 dark:text-gray-400 font-medium">Subtotal</Text>
              <Text className="text-gray-900 dark:text-white font-bold">${subtotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500 dark:text-gray-400 font-medium">Shipping</Text>
              <Text className="text-gray-900 dark:text-white font-bold">${shipping.toFixed(2)}</Text>
            </View>
            <View className="h-[1px] bg-gray-100 dark:bg-gray-800 my-1" />
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-900 dark:text-white text-xl font-bold">Total</Text>
              <Text className="text-blue-500 text-xl font-bold">${total.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity 
            className="bg-blue-500 w-full py-4 rounded-2xl items-center shadow-lg shadow-blue-500/30 flex-row justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg mr-2">Checkout</Text>
            <Feather name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
};

export default CartScreen;
