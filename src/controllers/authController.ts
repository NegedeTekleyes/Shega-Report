// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import pool from "../config/database";
import { error } from "console";

// -----------------------------
// REGISTER
// -----------------------------
export const register = async (req: Request, res: Response) => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {

    if(password !== confirmPassword){
      return res.status(400).json({error: "Password do not match"})
    }
    // Check if user exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await pool.query(
      `INSERT INTO users (full_name, email, password, is_verified)
       VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, is_verified`,
      [fullName, email, hashedPassword, true]
    );

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET!;
    const token = jwt.sign(
      { userId: newUser.rows[0].id },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as SignOptions
    );

  
    res.status(201).json({
      success: true,
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        name: newUser.rows[0].full_name,
        // role: newUser.rows[0].role,
        // phone: newUser.rows[0].phone,
        isVerified: newUser.rows[0].is_verified
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// -----------------------------
// LOGIN
// -----------------------------
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const userQuery = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userQuery.rows.length === 0)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = userQuery.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    // Optional: check if verified
    if (!user.is_verified) {
      return res.status(403).json({ error: "Account not verified" });
    }

    const jwtSecret = process.env.JWT_SECRET!;
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as SignOptions);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
        phone: user.phone,
        isVerified: user.is_verified,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -----------------------------
// OPTIONAL: VERIFY USER (for future)
// -----------------------------
export const verifyUser = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const updatedUser = await pool.query(
      "UPDATE users SET is_verified = true WHERE id = $1 RETURNING id, full_name, email, role, phone, is_verified",
      [userId]
    );

    if (updatedUser.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.status(200).json({ success: true, user: updatedUser.rows[0] });
  } catch (error) {
    console.error("Verify user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
