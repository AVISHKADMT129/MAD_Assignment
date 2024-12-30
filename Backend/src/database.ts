import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let db: Database | null = null; // Singleton instance

export const initDB = async () => {
  if (db) {
    // Return the existing database instance
    return db;
  }

  try {
    db = await open({
      filename: "./data.db",
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);

    console.log("Database initialized successfully.");
    return db;
  } catch (error) {
    console.error("Error initializing the database:", (error as any).message);
    throw error;
  }
};
