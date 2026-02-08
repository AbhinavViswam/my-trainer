import { View, Text, useColorScheme, Pressable } from "react-native";
import React, { useCallback, useState } from "react";
import { getWeightChartData, initWeightDB } from "@/db/weightQuery";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import "../global.css";
import { useFocusEffect } from "@react-navigation/native";
import { RefreshCcw } from "lucide-react-native";

const WeightChart = () => {
  const [data, setData] = useState<any[]>([]);
  const colorScheme = useColorScheme();

  const fetchData = () => {
    initWeightDB();
    const datas = getWeightChartData();
    const formatted = datas.map((item: any) => ({
      value: item.y,
      label: dayjs(item.x).format("DD MMM"),
    }));
    setData(formatted);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  if (data.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-400 text-base">
            No weight data yet
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const latestWeight = data[data.length - 1]?.value;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-5 flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Weight Progress
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Latest: {latestWeight} kg
            </Text>
          </View>

          <Pressable
            onPress={fetchData}
            className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full active:opacity-70"
          >
            <RefreshCcw
              size={20}
              color={colorScheme === "dark" ? "#6ee7b7" : "#059669"}
            />
          </Pressable>
        </View>

        {/* Chart Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <LineChart
            areaChart
            data={data}
            height={220}
            spacing={50}
            thickness={2}
            color={colorScheme === "dark" ? "#34d399" : "#059669"}
            startFillColor={
              colorScheme === "dark"
                ? "rgba(52,211,153,0.4)"
                : "rgba(5,150,105,0.3)"
            }
            endFillColor="transparent"
            hideRules
            // Axis
            xAxisColor={colorScheme === "dark" ? "#374151" : "#e5e7eb"}
            yAxisColor={colorScheme === "dark" ? "#374151" : "#e5e7eb"}
            xAxisLabelTextStyle={{
              color: colorScheme === "dark" ? "#9ca3af" : "#6b7280",
              fontSize: 10,
            }}
            yAxisTextStyle={{
              color: colorScheme === "dark" ? "#9ca3af" : "#6b7280",
              fontSize: 10,
            }}
            // Data points
            dataPointsColor={colorScheme === "dark" ? "#34d399" : "#059669"}
            dataPointsRadius={4}
            // Tooltip / Focus
            focusEnabled
            showDataPointOnFocus
            showStripOnFocus
            showTextOnFocus
            stripColor={colorScheme === "dark" ? "#6b7280" : "#9ca3af"}
            textColor={colorScheme === "dark" ? "#fff" : "#000"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WeightChart;
