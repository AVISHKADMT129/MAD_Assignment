import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail, getUserByUsername } from "../models/userModels";

// Use environment variables for sensitive data
const SECRET_KEY = process.env.SECRET_KEY || "defaultsecretkey";

// Email and Username validation regex
const emailRegex = /\S+@\S+\.\S+/;
const usernameRegex = /^[a-zA-Z0-9_]+$/; // Example regex for username validation

// Signup Controller
export const signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        res.status(400).json({ message: "All fields are required." });
        console.log("All fields are required.");
        return;
    }

    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Invalid email address." });
        console.log("Invalid email address.");
        return;
    }

    if (!usernameRegex.test(username)) {
        res.status(400).json({ message: "Invalid username. Only alphanumeric characters and underscores are allowed." });
        console.log("Invalid username. Only alphanumeric characters and underscores are allowed.");
        return;
    }

    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: "Email already in use." });
            console.log("Email already in use.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(username, email, hashedPassword);

        res.status(201).json({ message: "User registered successfully." });
        console.log("User registered successfully.");
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Server error during signup." });
        console.log("Server error during signup.");
    }
};

// Login Controller
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log("Login request received:", username, password);

    // Validate input
    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required." });
        console.log("Username and password are required.");
        return;
    }

    if (!usernameRegex.test(username)) {
        res.status(400).json({ message: "Invalid username format." });
        console.log("Invalid username format.");
        return;
      }

    try {
        const user = await getUserByUsername(username);

        if (!user) {
            res.status(401).json({ message: "Invalid credentials." });
            console.log("Invalid credentials. User not found.");
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: "Invalid credentials." });
            console.log("Invalid credentials. Password does not match.");
            return;
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            token,
            message: "User logged in successfully.",
        });
        console.log("User logged in successfully.");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};
