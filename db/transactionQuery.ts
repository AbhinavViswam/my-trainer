import { Transaction } from "@/types/types";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("workouts.db");

export const initDB = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        date TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.log("DB init error", error);
    throw error;
  }
};

export const insertTransaction = (amount: number, date: string): number => {
  try {
    const result = db.runSync(
      "INSERT INTO transactions (amount, date) VALUES (?, ?);",
      amount,
      date,
    );

    return result.lastInsertRowId as number;
  } catch (error) {
    console.log("Insert error", error);
    throw error;
  }
};

export const getTransactions = (): Transaction[] => {
  try {
    const result = db.getAllSync<Transaction>(
      "SELECT * FROM transactions ORDER BY date DESC;",
    );

    return result;
  } catch (error) {
    console.log("Get transactions error", error);
    throw error;
  }
};

export const deleteTransaction = (id: number): void => {
  try {
    db.runSync("DELETE FROM transactions WHERE id = ?;", id);
  } catch (error) {
    console.log("Delete transaction error", error);
    throw error;
  }
};
