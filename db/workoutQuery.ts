import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("workouts.db");

export const initWorkoutLogDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS workout_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      workout_id INTEGER,
      FOREIGN KEY (workout_id) REFERENCES userworkouts(id)
    );
  `);
};

export const insertWorkoutLogs = (date: string, workoutIds: number[]) => {
  workoutIds.forEach((id) => {
    db.runSync(
      "INSERT INTO workout_logs (date, workout_id) VALUES (?, ?);",
      date,
      id,
    );
  });
};

export const getWorkoutHistory = () => {
  return db.getAllSync<{
    id: number;
    date: string;
    name: string;
    category: string;
  }>(`
    SELECT wl.id, wl.date, uw.name, uw.category
    FROM workout_logs wl
    JOIN userworkouts uw
    ON wl.workout_id = uw.id
    ORDER BY wl.date DESC;
  `);
};

export const deleteWorkoutHistory = (id: number) => {
  try {
    db.runSync("DELETE FROM workout_logs WHERE id = ?;", id);
  } catch (error) {
    console.log("Delete workout history error", error);
    throw error;
  }
};