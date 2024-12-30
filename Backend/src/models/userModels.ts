import { initDB } from "../database";

// Get user by email
export const getUserByEmail = async (email: string) => {
  const db = await initDB();
  return await db.get("SELECT * FROM users WHERE email = ?", [email]);
};

// Get user by username
export const getUserByUsername = async (username: string) => {
  const db = await initDB();
  const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);
  console.log("User fetched by username:", user); // Debugging
  if (!user) {
    console.log("No user found with this username");
  }
  return user;
};

// Create new user
export const createUser = async (username: string, email: string, password: string) => {
  const db = await initDB();
  const result = await db.run(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password]
  );
  console.log("User created:", result); // Debugging
  return result;
};
