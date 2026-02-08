import React, { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WeightChart from "./WeightChart";
import WorkoutRadar from "./WorkoutRadar";
import * as SecureStore from "expo-secure-store";
import "../global.css";
import { USERNAME_KEY } from "./UserPage";
import { useFocusEffect } from "@react-navigation/native";

const Home = () => {
  const [username, setUsername] = useState("");
  const loadUsername = async () => {
    const storedName = await SecureStore.getItemAsync(USERNAME_KEY);
    if (storedName) {
      setUsername(storedName);
    } else {
      setUsername("User");
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadUsername();
    }, []),
  );
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4">
          <View className="bg-white flex-row items-center justify-between dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back
            </Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {username ? username : "User"}
            </Text>
          </View>
        </View>
        <View>
          <WorkoutRadar />
          <WeightChart />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
