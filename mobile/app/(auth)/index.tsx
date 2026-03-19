import useSocialAuth from "@/hooks/useSocialAuth";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { isLoading, handleSocialAuth } = useSocialAuth();
  const [clickedAuthMethod, setClickedAuthMethod] = useState<string>("");

  return (
    <View className="flex-1 bg-white px-6 pt-12 pb-8">
      {/* Top Section with Image and Text */}
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("@/assets/images/auth-image.png")}
          className="w-full h-72"
          resizeMode="contain"
        />

        <View className="mt-10 items-center w-full px-4">
          <Text className="text-3xl font-bold text-gray-900 text-center tracking-tight">
            Welcome to Shoppy
          </Text>
          <Text className="text-base text-gray-500 text-center mt-3 leading-6">
            Sign in to discover the best products, exclusive deals, and a
            seamless shopping experience.
          </Text>
        </View>
      </View>

      {/* Bottom Section with Buttons */}
      <View className="w-full mt-8 mb-6 gap-3.5">
        {/* Google Sign In */}
        <TouchableOpacity
          className="flex-row items-center bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 shadow-sm shadow-black/60"
          onPress={() => {
            setClickedAuthMethod("oauth_google");
            handleSocialAuth("oauth_google");
          }}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {isLoading && clickedAuthMethod === "oauth_google" ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size={"small"} color="#4285f4" />
            </View>
          ) : (
            <View className="flex-row items-center w-full">
              <Image
                source={require("@/assets/images/google.png")}
                className="w-9 h-9"
                resizeMode="contain"
              />
              <Text className="flex-1 text-center text-gray-800 text-base font-semibold pr-6">
                Continue with Google
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Apple Sign In */}
        <TouchableOpacity
          className="flex-row items-center bg-gray-50 border border-gray-200 rounded-full px-6 py-4 shadow-sm shadow-black/60"
          onPress={() => {
            setClickedAuthMethod("oauth_apple");
            handleSocialAuth("oauth_apple");
          }}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {isLoading && clickedAuthMethod === "oauth_apple" ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="small" color="#000000" />
            </View>
          ) : (
            <View className="flex-row items-center w-full">
              <Image
                source={require("@/assets/images/apple.png")}
                className="w-6 h-6"
                resizeMode="contain"
              />
              <Text className="flex-1 text-center text-gray-800 text-base font-semibold pr-6">
                Continue with Apple
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer Text */}
      <Text className="text-center text-gray-500 text-xs leading-5 px-4 mb-2">
        By continuing, you agree to our{" "}
        <Text className="text-blue-600 font-medium">Terms of Service</Text> and{" "}
        <Text className="text-blue-600 font-medium">Privacy Policy</Text>.
      </Text>
    </View>
  );
}
