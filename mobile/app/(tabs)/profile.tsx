import SafeScreen from "@/components/SafeScreen";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type MenuItemProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showBorder?: boolean;
};

const MenuItem = ({
  icon,
  title,
  rightElement,
  onPress,
  showBorder = true,
}: MenuItemProps) => (
  <TouchableOpacity
    className={`flex-row items-center py-4 px-4 ${showBorder ? "border-b border-neutral-800" : ""}`}
    onPress={onPress}
    disabled={!onPress && !rightElement}
    activeOpacity={0.7}
  >
    <View className="w-10 h-10 rounded-full bg-neutral-900 items-center justify-center mr-4">
      <Feather name={icon} size={20} color="#1cc46b" />
    </View>
    <Text className="text-neutral-300 font-medium text-base flex-1">
      {title}
    </Text>
    {rightElement || <Feather name="chevron-right" size={20} color="#787878" />}
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const router = useRouter();

  return (
    <SafeScreen>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header section with User Info */}
        <View className="px-6 py-8 items-center border-b border-neutral-800">
          <View className="relative">
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=68" }}
              className="w-24 h-24 rounded-full border-2 border-neutral-800"
            />
          </View>
          <Text className="text-2xl font-bold mt-4 text-white">John Doe</Text>
          <Text className="text-gray-500 mt-1 font-medium">
            johndoe@example.com
          </Text>

          <View className="flex w-full gap-3">
            <TouchableOpacity className="w-full mt-5 bg-[#1cc46b] py-4 rounded-xl flex items-center shadow-lg shadow-[#1cc46b]/20">
              <Text className="text-white font-semibold text-base">
                Edit Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full flex-row items-center justify-center py-4 bg-neutral-900 rounded-xl mb-4 border border-red-900/30"
              activeOpacity={0.7}
            >
              <Feather
                name="log-out"
                size={18}
                color="#ef4444"
                className="mr-2"
              />
              <Text className="text-red-500 font-bold text-base ml-2">
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-4 py-6">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-2">
            My Account
          </Text>
          <View className="bg-neutral-900 rounded-2xl mb-6 overflow-hidden border border-neutral-800">
            <MenuItem 
              icon="shopping-bag" 
              title="My Orders" 
              onPress={() => router.push("/orders")}
            />
            <MenuItem 
              icon="heart" 
              title="Wishlist" 
              onPress={() => router.push("/(tabs)/wishlist")}
            />
            <MenuItem icon="map-pin" title="Shipping Address" />
          </View>

          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-2">
            Settings
          </Text>
          <View className="bg-neutral-900 rounded-2xl mb-6 overflow-hidden border border-neutral-800">
            <MenuItem
              icon="bell"
              title="Notifications"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#3f3f3f", true: "#1cc46b" }}
                  thumbColor="#ffffff"
                />
              }
            />
            <MenuItem
              icon="moon"
              title="Dark Mode"
              rightElement={
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: "#3f3f3f", true: "#1cc46b" }}
                  thumbColor="#ffffff"
                />
              }
            />
          </View>

          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-2">
            Support
          </Text>
          <View className="bg-neutral-900 rounded-2xl mb-6 overflow-hidden border border-neutral-800">
            <MenuItem icon="help-circle" title="Help Center" />
            <MenuItem icon="info" title="About Us" showBorder={false} />
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default ProfileScreen;
