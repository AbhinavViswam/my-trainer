import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("workouts.db");

// Master table (exercises)
export const initUserWorkoutDB = () => {
  try {
    db.execSync(`
       CREATE TABLE IF NOT EXISTS userworkouts (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         category TEXT,
         name TEXT NOT NULL
       );
     `);
  } catch (error) {
    console.log("DB init error", error);
    throw error;
  }
};

// Insert exercise
export const insertUserWorkout = (category: string, name: string) => {
  try {
    db.runSync(
      "INSERT INTO userworkouts (category, name) VALUES (?, ?);",
      category,
      name,
    );
  } catch (error) {
    console.log("Insert error", error);
    throw error;
  }
};

// Get all exercises
export const getUserWorkouts = () => {
  try {
    const result = db.getAllSync<{
      id: number;
      category: string;
      name: string;
    }>("SELECT * FROM userworkouts ORDER BY category;");
    return result;
  } catch (error) {
    console.log("Get user workouts error", error);
    throw error;
  }
};

export const deleteUserWorkouts = (id: number) => {
  try {
    const result = db.getFirstSync<{ count: number }>(
      "SELECT COUNT(*) as count FROM workout_logs WHERE workout_id = ?;",
      id,
    );
    if (result && result.count > 0) {
      return false;
    }
    db.runSync("DELETE FROM userworkouts WHERE id = ?;", id);
  } catch (error) {
    console.log("Delete userworkout error", error);
    throw error;
  }
};
