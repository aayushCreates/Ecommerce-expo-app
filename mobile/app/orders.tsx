import SafeScreen from "@/components/SafeScreen";
import useOrders from "@/hooks/useOrders";
import { Order } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

const OrderCard = ({ order }: { order: Order }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-500 bg-green-500/10";
      case "shipped":
        return "text-blue-500 bg-blue-500/10";
      case "pending":
        return "text-yellow-500 bg-yellow-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View className="bg-neutral-900 border border-neutral-800 rounded-2xl mb-4 overflow-hidden">
      <View className="p-4 border-b border-neutral-800 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">
            Order ID: {order._id.slice(-8).toUpperCase()}
          </Text>
          <Text className="text-white font-bold mt-0.5">
            {formatDate(order.createdAt)}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status).split(' ')[1]}`}>
          <Text className={`text-xs font-bold uppercase ${getStatusColor(order.status).split(' ')[0]}`}>
            {order.status}
          </Text>
        </View>
      </View>

      <View className="p-4">
        {order.orderItems.slice(0, 2).map((item, index) => (
          <View key={item._id} className={`flex-row items-center ${index > 0 ? 'mt-3' : ''}`}>
            <Image 
              source={{ uri: item.image }} 
              className="w-12 h-12 rounded-lg bg-neutral-800"
            />
            <View className="ml-3 flex-1">
              <Text className="text-gray-200 font-medium" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-gray-500 text-xs">
                {item.quantity} x ${item.price}
              </Text>
            </View>
          </View>
        ))}
        
        {order.orderItems.length > 2 && (
          <Text className="text-gray-500 text-xs mt-2 ml-15">
            + {order.orderItems.length - 2} more items
          </Text>
        )}
      </View>

      <View className="p-4 bg-neutral-900/50 border-t border-neutral-800 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-xs">Total Amount</Text>
          <Text className="text-[#1cc46b] font-bold text-lg">${order.totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity className="bg-neutral-800 px-4 py-2 rounded-xl">
          <Text className="text-white font-semibold text-xs">View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const OrdersScreen = () => {
  const { orders, isLoading } = useOrders();
  const router = useRouter();

  if (isLoading) {
    return (
      <SafeScreen>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1cc46b" />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View className="flex-1 bg-black px-4">
        <View className="flex-row items-center py-6">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-neutral-900 rounded-full items-center justify-center mr-4"
          >
            <Feather name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">My Orders</Text>
        </View>

        {orders.length === 0 ? (
          <View className="flex-1 justify-center items-center px-8">
            <View className="w-20 h-20 bg-neutral-900 rounded-full items-center justify-center mb-6">
              <Ionicons name="receipt-outline" size={40} color="#1cc46b" />
            </View>
            <Text className="text-xl font-bold text-white mb-2">No Orders Yet</Text>
            <Text className="text-gray-500 text-center mb-8">
              Looks like you haven't made any purchases yet. Start shopping and track your orders here.
            </Text>
            <TouchableOpacity 
              onPress={() => router.push("/")}
              className="bg-[#1cc46b] px-8 py-4 rounded-2xl"
            >
              <Text className="text-white font-bold">Explore Store</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={({ item }) => <OrderCard order={item} />}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </SafeScreen>
  );
};

export default OrdersScreen;
