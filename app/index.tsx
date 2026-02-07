import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, useColorScheme } from "react-native";
import Transactions from "@/components/Transactions";
import "../global.css";
import TabBarIcon from "@/components/TabBarIcons";
import MyWorkouts from "@/components/MyWorkouts";
import React from "react";
import { initUserWorkoutDB } from "@/db/userWorkoutQuery";
import { initWorkoutLogDB } from "@/db/workoutQuery";
import { initDB } from "@/db/transactionQuery";
import UserPage from "@/components/UserPage";
const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Text className="text-xl font-semibold text-gray-900 dark:text-white">
        Home
      </Text>
    </View>
  );
}

export default function App() {
  const isDark = useColorScheme() === "dark";
  React.useEffect(() => {
    initUserWorkoutDB();
    initWorkoutLogDB();
    initDB();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#111827" : "#ffffff",
          borderTopWidth: 0,
          height: 64,
        },
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: isDark ? "#9ca3af" : "#6b7280",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 6,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="home" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Workouts"
        component={MyWorkouts}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="workouts" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Payments"
        component={Transactions}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="payments" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={UserPage}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
