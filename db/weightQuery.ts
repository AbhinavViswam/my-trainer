import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("workouts.db");

// Create table
export const initWeightDB = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS weight_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        weight REAL NOT NULL,
        date TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.log("Weight DB init error", error);
    throw error;
  }
};

// Insert weight
export const insertWeight = (weight: number, date: string) => {
  try {
    db.runSync(
      "INSERT INTO weight_logs (weight, date) VALUES (?, ?);",
      weight,
      date
    );
  } catch (error) {
    console.log("Insert weight error", error);
    throw error;
  }
};

// Get history (optional later)
export const getWeights = () => {
  return db.getAllSync<{
    id: number;
    weight: number;
    date: string;
  }>("SELECT * FROM weight_logs ORDER BY date DESC;");
};


export const getWeightChartData = () => {
  try {
    const result = db.getAllSync<{
      date: string;
      weight: number;
    }>(
      "SELECT date, weight FROM weight_logs ORDER BY date ASC;"
    );

    // Convert to Victory format
    const formatted = result.map((item) => ({
      x: new Date(item.date),
      y: item.weight,
    }));

    return formatted;
  } catch (error) {
    console.log("Get weight chart data error", error);
    throw error;
  }
};