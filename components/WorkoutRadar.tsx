import { View, Text, useColorScheme, Pressable } from "react-native";
import React, { useCallback } from "react";
import { PieChart, RadarChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { getWorkoutTrend } from "@/db/workoutQuery";
import { useFocusEffect } from "@react-navigation/native";
import "../global.css";
import { RefreshCcw } from "lucide-react-native";

const WorkoutRadar = () => {
  const [data, setData] = React.useState<number[]>([]);
  const [labels, setLabels] = React.useState<string[]>([]);
  const [pieData, setPieData] = React.useState<any[]>([]);
  const [summary, setSummary] = React.useState<
    { label: string; value: number; color: string }[]
  >([]);

  const colorScheme = useColorScheme();

  const fetchData = () => {
    const datas = getWorkoutTrend();

    const values = datas.map((item: any) => item.count);
    const names = datas.map((item: any) =>
      item.category.trim().replace("And", "+"),
    );

    setData(values);
    setLabels(names);

   const colors = [
  "#34D399", // green (emerald-400)
  "#60A5FA", // blue (blue-400)
  "#818CF8", // indigo (indigo-400)
  "#FBBF24", // yellow (amber-400)
  "#F87171", // red (red-400)
  "#FB923C", // orange (orange-400)
];



    const total = values.reduce((a, b) => a + b, 0);

    const pie = datas.map((item: any, index: number) => ({
      value: item.count,
      color: colors[index % colors.length],
      text: `${item.count} (${Math.round((item.count / total) * 100)}%)`,
      label: names[index],
    }));

    setPieData(pie);

    const summaryData = datas.map((item: any, index: number) => ({
      label: names[index],
      value: item.count,
      color: colors[index % colors.length],
    }));

    setSummary(summaryData);
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
          <Text className="text-gray-500 dark:text-gray-400">
            No workout data
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const maxValue = Math.max(...data);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-5">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Workout Distribution
          </Text>

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

        {/* Summary Grid */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Workout Days
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {summary.map((item, index) => (
              <View
                key={index}
                className="w-[48%] mb-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                    {item.label}
                  </Text>

                  <View
                    style={{ backgroundColor: item.color }}
                    className="w-2 h-2 rounded-full"
                  />
                </View>

                <Text className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {item.value}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  days
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pie Chart Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mt-6 shadow-sm border border-gray-200 dark:border-gray-700 items-center mb-6">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Workout Share
          </Text>

          <PieChart
            data={pieData}
            showText
            textColor="white"
            radius={120}
            textSize={12}
            fontWeight="900"
          />

          {/* Legend */}
          <View className="mt-4 w-full">
            {pieData.map((item, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between mb-2"
              >
                <View className="flex-row items-center">
                  <View
                    style={{ backgroundColor: item.color }}
                    className="w-3 h-3 rounded-full mr-2"
                  />
                  <Text className="text-gray-700 dark:text-gray-300 text-sm">
                    {item.label}
                  </Text>
                </View>

                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 items-center">
          <RadarChart
            data={data}
            labels={labels}
            maxValue={maxValue + 1}
            gridConfig={{
              showGradient: true,
              gradientColor:
                colorScheme === "dark"
                  ? "rgba(5,150,105,0.3)"
                  : "rgba(5,150,105,0.3)",
              fill:
                colorScheme === "dark"
                  ? "rgba(5,150,105,0.3)"
                  : "rgba(5,150,105,0.3)",
            }}
            polygonConfig={{
              stroke: colorScheme === "dark" ? "white" : "red",
              fill: colorScheme === "dark" ? "white" : "red",
              gradientColor: colorScheme === "dark" ? "white" : "red",
              showGradient: true,
              isAnimated: true,
              animationDuration: 300,
            }}
            labelConfig={{
              stroke: colorScheme === "dark" ? "white" : "red",
              fontWeight: "600",
              fontSize: 10,
            }}
            dataLabels={data.map((v) => v.toString())}
            dataLabelsConfig={{
              stroke: "transparent",
            }}
            chartContainerProps={{}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WorkoutRadar;
