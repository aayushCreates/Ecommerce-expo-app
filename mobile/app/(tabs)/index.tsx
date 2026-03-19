import ProductsGrid from "@/components/ProductsGrid";
import SafeScreen from "@/components/SafeScreen";
import useProducts from "@/hooks/useProducts";
import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import React, { useMemo, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const categories = [
  {
    name: "All",
    icon: "grid-outline",
  },
  {
    name: "Electronics",
    image: require("@/assets/images/electronics.png"),
  },
  {
    name: "Fashion",
    image: require("@/assets/images/fashion.png"),
  },
  {
    name: "Sports",
    image: require("@/assets/images/sports.png"),
  },
  {
    name: "Books",
    image: require("@/assets/images/books.png"),
  },
];

const HomeScreen = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data: products, isLoading, isError } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products;
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchInput.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    return filtered;
  }, [products, searchInput, selectedCategory]);

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pb-4 pt-6">
          <View className="flex-row items-center justify-between mb-6">
            {/* Left-side */}
            <View>
              <Text className="text-text-primary text-3xl font-bold tracking-tight">
                Shop
              </Text>
              <Text className="text-text-secondary text-sm mt-1">
                Browse all products
              </Text>
            </View>

            {/* Right Side */}
            <TouchableOpacity
              className="bg-surface/50 p-3 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons name="options-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* SearchBar */}
          <View className="bg-surface flex-row items-center px-5 py-1.5 rounded-full">
            <Ionicons color={"#666"} size={22} name="search" />
            <TextInput
              placeholder="Search for products"
              placeholderTextColor="#666"
              className="flex-1 ml-3 text-base text-text-primary"
              value={searchInput}
              onChangeText={setSearchInput}
            />
          </View>
        </View>

        {/* Category filter */}
        <View className="mb-6">
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
          >
            {categories.map((c, i) => {
              const isSelected = selectedCategory === c.name;
              return (
                <TouchableOpacity
                  key={c.name}
                  onPress={() => setSelectedCategory(c.name)}
                  className={`mr-3 rounded-full overflow-hidden items-center justify-center ${
                    isSelected ? "bg-primary" : "bg-surface"
                  }`}
                >
                  {c.icon ? (
                    <Ionicons
                      name={c.icon}
                      size={28}
                      color={isSelected ? "#121212" : "#fff"}
                      className="p-4"
                    />
                  ) : (
                    <Image source={c.image} className="size-16" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <Button
          title="Try!"
          onPress={() => {
            Sentry.captureException(new Error("First Error"));
          }}
        />

        {/* Items */}
        <View className="px-6 mb-6">
          {/* items count */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary text-lg font-bold">
              Products
            </Text>
            <Text className="text-text-secondary text-sm font-bold">
              {filteredProducts.length} Items
            </Text>
          </View>

          {/* Products GRID */}
          <ProductsGrid
            products={filteredProducts}
            isLoading={isLoading}
            isError={isError}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default HomeScreen;
