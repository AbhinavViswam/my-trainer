import {
  View,
  Text,
  Pressable,
  Platform,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  deleteUserWorkouts,
  getUserWorkouts,
  initUserWorkoutDB,
  insertUserWorkout,
} from "@/db/userWorkoutQuery";
import {
  deleteWorkoutHistory,
  getWorkoutHistory,
  insertWorkoutLogs,
} from "@/db/workoutQuery";
import { Trash2 } from "lucide-react-native";

const WORKOUT_TYPES = [
  "Chest",
  "Arms",
  "Shoulders",
  "Legs",
  "Abs",
  "Cardio",
  "Full Body",
];

const MyWorkouts = () => {
  const [date, setDate] = useState(new Date());
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteType, setDeleteType] = useState<
    "history" | "userworkout" | null
  >(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutTypes, setWorkoutTypes] = useState<
    { id: number; category: string; name: string }[]
  >([]);
  const [history, setHistory] = useState<
    { id: number; date: string; name: string; category: string }[]
  >([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState<number[]>([]);

  React.useEffect(() => {
    initUserWorkoutDB();
    fetchWorkouts();
    fetchHistory();
  }, []);

  const openDeleteHistory = (id: number) => {
    setSelectedId(id);
    setDeleteType("history");
    setDeleteModalVisible(true);
  };

  const openDeleteUserWorkout = (id: number) => {
    setSelectedId(id);
    setDeleteType("userworkout");
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedId === null) return;

    if (deleteType === "history") {
      deleteWorkoutHistory(selectedId);
      fetchHistory();
    }

    if (deleteType === "userworkout") {
      deleteUserWorkouts(selectedId);
      setSelectedId(null)
      fetchWorkouts();
    }

    setSelectedId(null);
    setDeleteType(null);
    setDeleteModalVisible(false);
  };

  const cancelDelete = () => {
    setSelectedId(null);
    setDeleteType(null);
    setDeleteModalVisible(false);
  };

  const fetchHistory = () => {
    const data = getWorkoutHistory();
    setHistory(data);
  };
  const fetchWorkouts = () => {
    const data = getUserWorkouts();
    setWorkoutTypes(data);
  };

  const toggleWorkout = (id: number) => {
    if (selectedWorkouts.includes(id)) {
      setSelectedWorkouts(selectedWorkouts.filter((w) => w !== id));
    } else {
      setSelectedWorkouts([...selectedWorkouts, id]);
    }
  };

  const saveWorkout = () => {
    if (selectedWorkouts.length === 0) return;
    insertWorkoutLogs(date.toISOString(), selectedWorkouts);
    setSelectedWorkouts([]);
    setDate(new Date());
    fetchHistory();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-1 p-5">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Workout Logs
          </Text>

          <Pressable
            onPress={() => setModalVisible(true)}
            className="bg-emerald-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Create</Text>
          </Pressable>
        </View>

        {/* Date */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date
        </Text>

        <Pressable
          onPress={() => setShowDatePicker(true)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 mb-6"
        >
          <Text className="text-base text-gray-900 dark:text-white">
            {dayjs(date).format("DD MMM YYYY")}
          </Text>
        </Pressable>

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

        {/* Workout Checkboxes */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Workout Type
        </Text>

        <View>
          {workoutTypes?.length > 0 ? (
            <View className="flex-row flex-wrap gap-3 mb-8">
              {workoutTypes.map((item) => {
                const selected = selectedWorkouts.includes(item.id);

                return (
                  <Pressable
                    key={item.id}
                    onLongPress={() => openDeleteUserWorkout(item.id)}
                    delayLongPress={400}
                    onPress={() => toggleWorkout(item.id)}
                    className={`px-4 py-2 rounded-full border
          ${
            selected
              ? "bg-emerald-600 border-emerald-600"
              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          }`}
                  >
                    <Text
                      className={`text-sm font-medium
            ${selected ? "text-white" : "text-gray-800 dark:text-gray-200"}`}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text className="dark:text-red-300 text-red-500 text-center w-full mb-2">
              Please create a workout
            </Text>
          )}
        </View>

        {/* Save Button */}
        <Pressable
          onPress={saveWorkout}
          className="bg-emerald-600 dark:bg-emerald-500 rounded-xl py-4 items-center active:opacity-80"
        >
          <Text className="text-white font-semibold text-base">
            Save Workout
          </Text>
        </Pressable>

        {/* History Section */}
        <View className="flex-1 mt-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Workout History
          </Text>

          {history.length === 0 ? (
            <Text className="text-gray-500 dark:text-gray-400">
              No workouts logged yet
            </Text>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <View className="bg-white dark:bg-gray-800 p-3 mb-2 rounded-xl border border-gray-200 dark:border-gray-700 flex-row justify-between items-center">
                  <View>
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      {item.category}
                    </Text>
                    <Text className="text-xs text-gray-400 mt-1">
                      {dayjs(item.date).format("DD MMM YYYY")}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => openDeleteHistory(item.id)}
                    className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"
                  >
                    <Trash2 size={18} color="red" />
                  </Pressable>
                </View>
              )}
            />
          )}
        </View>
      </View>
      <Modal
        transparent
        visible={deleteModalVisible}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View className="flex-1 bg-black/40 items-center justify-center">
          <View className="bg-white dark:bg-gray-800 w-[85%] rounded-2xl p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confirm Delete
            </Text>

            <Text className="text-gray-600 dark:text-gray-400 mb-6">
              {deleteType === "history"
                ? "Delete this workout log?"
                : "Delete this workout type? This cannot be undone."}
            </Text>

            <View className="flex-row justify-end gap-3">
              <Pressable
                onPress={cancelDelete}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                <Text className="text-gray-800 dark:text-gray-200">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600"
              >
                <Text className="text-white font-semibold">Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/40 items-center justify-center">
          <View className="bg-white dark:bg-gray-800 w-[85%] rounded-2xl p-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create Workout
            </Text>
            {/* Category */}
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Category
            </Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. chest_day"
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 mb-4 text-gray-900 dark:text-white"
            />

            {/* Name */}
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Workout Name
            </Text>
            <TextInput
              value={workoutName}
              onChangeText={setWorkoutName}
              placeholder="e.g. Incline Dumbbell Press"
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 mb-6 text-gray-900 dark:text-white"
            />

            {/* Buttons */}
            <View className="flex-row justify-end gap-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                <Text className="text-gray-800 dark:text-gray-200">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (!category || !workoutName) return;

                  insertUserWorkout(category, workoutName);

                  setCategory("");
                  setWorkoutName("");
                  setModalVisible(false);

                  fetchWorkouts();
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600"
              >
                <Text className="text-white font-semibold">Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MyWorkouts;
