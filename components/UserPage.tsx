import {
  View,
  Text,
  Pressable,
  TextInput,
  Modal,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { User as UserIcon, Pencil } from "lucide-react-native";

export const USERNAME_KEY = "username";
export const MEMBER_SINCE_KEY = "member_since";

const UserPage = () => {
  const [username, setUsername] = useState("User");
  const [memberSince, setMemberSince] = useState("");
  const [editName, setEditName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const isDark = useColorScheme() === "dark";
  const Color = isDark ? "white" : "black";

  useEffect(() => {
    loadUsername();
    initMemberSince();
  }, []);

  const initMemberSince = async () => {
    const existing = await SecureStore.getItemAsync(MEMBER_SINCE_KEY);
    if (!existing) {
      await SecureStore.setItemAsync(
        MEMBER_SINCE_KEY,
        new Date().toISOString(),
      );
    }
  };

  const loadUsername = async () => {
    const storedName = await SecureStore.getItemAsync(USERNAME_KEY);
    if (storedName) setUsername(storedName);

    const since = await SecureStore.getItemAsync(MEMBER_SINCE_KEY);
    if (since) {
      setMemberSince(
        new Date(since).toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        }),
      );
    }
  };

  const saveUsername = async () => {
    if (!editName.trim()) return;

    await SecureStore.setItemAsync(USERNAME_KEY, editName.trim());
    setUsername(editName.trim());
    setEditName("");
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-1 items-center pt-10 px-5">
        {/* User Icon */}
        <View className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full mb-4">
          <UserIcon size={48} color="#059669" />
        </View>

        {/* Username Row */}
        <View className="flex-row items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mr-3">
            {username}
          </Text>

          <Pressable
            onPress={() => {
              setEditName(username);
              setModalVisible(true);
            }}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
          >
            <Pencil size={16} color={Color} />
          </Pressable>
        </View>

        {/* Stats Card */}
        {/* Profile Summary Card */}
        <View className="w-full bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profile
          </Text>

          <View className="flex-row justify-between mb-3">
            <View>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Focus
              </Text>
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                Workout Tracking
              </Text>
            </View>

            <View>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Member Since
              </Text>
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                {memberSince || "Today"}
              </Text>
            </View>
          </View>

          <View className="mt-2">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              Status
            </Text>
            <Text className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
              Stay Consistent 💪
            </Text>
          </View>
        </View>
      </View>

      {/* Edit Name Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/40 items-center justify-center">
          <View className="bg-white dark:bg-gray-800 w-[85%] rounded-2xl p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Username
            </Text>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter username"
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 mb-6 text-gray-900 dark:text-white"
            />

            <View className="flex-row justify-end gap-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                <Text className="text-gray-800 dark:text-gray-200">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={saveUsername}
                className="px-4 py-2 rounded-lg bg-emerald-600"
              >
                <Text className="text-white font-semibold">Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserPage;
