import { initDB } from "@/db/transactionQuery";
import { initUserWorkoutDB } from "@/db/userWorkoutQuery";
import { initWeightDB } from "@/db/weightQuery";
import { initWorkoutLogDB } from "@/db/workoutQuery";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  React.useEffect(() => {
    initUserWorkoutDB();
    initWorkoutLogDB();
    initDB();
    initWeightDB();
  }, []);
  return <Stack screenOptions={{headerShown:false}} />;
}
