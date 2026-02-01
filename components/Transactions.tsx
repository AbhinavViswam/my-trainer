import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  FlatList,
  useColorScheme,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import {
  deleteTransaction,
  getTransactions,
  initDB,
  insertTransaction,
} from "@/db/transactionQuery";
import { Transaction } from "@/types/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshCcw, Trash2 } from "lucide-react-native";
import "../global.css";

const Transactions = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const colorScheme = useColorScheme();
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    initDB();
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    const data = getTransactions();
    setTransactions(data);
  };

  const refresh = () => {
    fetchTransactions();
    setDate(new Date());
  };

  const addTransactionHandler = () => {
    if (!amount) return;
    insertTransaction(Number(amount), date.toISOString());
    setAmount("");
    fetchTransactions();
  };

  const openDeleteModal = (id: number) => {
    setSelectedTransactionId(id);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedTransactionId === null) return;

    deleteTransaction(selectedTransactionId);
    fetchTransactions();

    setSelectedTransactionId(null);
    setIsDeleteModalVisible(false);
  };

  const cancelDelete = () => {
    setSelectedTransactionId(null);
    setIsDeleteModalVisible(false);
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View className="flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 mb-2 rounded-xl shadow-sm">
      <Text className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
        ₹{item.amount}
      </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {dayjs(item.date).format("DD MMM YYYY")}
        </Text>
        <Pressable
          onPress={() => openDeleteModal(item.id)}
          className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 active:opacity-70"
        >
          <Trash2 size={16} color={"red"} />
        </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-5 pt-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Add Payment
          </Text>
          <Pressable
            onPress={refresh}
            className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full active:opacity-70"
          >
            <RefreshCcw
              size={20}
              color={colorScheme === "dark" ? "#6ee7b7" : "#059669"}
            />
          </Pressable>
        </View>

        {/* Amount Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount
          </Text>
          <TextInput
            placeholder="Enter amount"
            placeholderTextColor={
              colorScheme === "dark" ? "#9ca3af" : "#6b7280"
            }
            value={amount}
            keyboardType="number-pad"
            onChangeText={setAmount}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base"
          />
        </View>

        {/* Date Picker */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 active:opacity-70"
          >
            <Text className="text-base text-gray-900 dark:text-white">
              {dayjs(date).format("DD MMM YYYY")}
            </Text>
          </Pressable>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "android" ? "default" : "spinner"}
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Add Button */}
        <Pressable
          onPress={addTransactionHandler}
          className="bg-emerald-600 dark:bg-emerald-500 rounded-xl py-4 items-center active:opacity-80 mb-6"
        >
          <Text className="text-white font-semibold text-base">
            Add Payment
          </Text>
        </Pressable>

        {/* Transactions List */}
        <View>
          <View className="flex-row justify-between items-center mb-3 px-2">
            <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Amount
            </Text>
              <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Date
              </Text>
              <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Delete
              </Text>
          </View>

          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center py-12">
                <Text className="text-gray-500 dark:text-gray-400 text-base">
                  No transactions yet
                </Text>
              </View>
            }
          />
        </View>
      </View>
      <Modal
        transparent
        visible={isDeleteModalVisible}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View className="flex-1 bg-black/40 items-center justify-center">
          <View className="bg-white dark:bg-gray-800 w-[85%] rounded-2xl p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Transaction
            </Text>

            <Text className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this transaction?
            </Text>

            <View className="flex-row justify-end gap-3">
              <Pressable
                onPress={cancelDelete}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                <Text className="text-gray-800 dark:text-gray-200 font-medium">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600"
              >
                <Text className="text-white font-medium">Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Transactions;
