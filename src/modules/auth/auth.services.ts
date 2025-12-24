import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const registerUser = async (payload: any) => {
  const { name, email, password, phone, role = 'customer' } = payload;
  
  // Validate required fields
  if (!name || !email || !password || !phone) {
    throw new Error("All fields are required: name, email, password, phone");
  }
  
  // Check password length
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  
  // Check if user exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email.toLowerCase()]
  );
  
  if (existingUser.rows.length > 0) {
    throw new Error("User already exists");
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user
  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, name, email, phone, role`,
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );
  
  return result.rows[0];
};

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email.toLowerCase()]
  );
  
  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }
  
  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  
  if (!match) {
    throw new Error("Invalid email or password");
  }
  
  // Generate JWT token
  const secret = config.jwtSecret || "fallback_secret_for_debugging";
  if (!config.jwtSecret) {
      console.warn("WARNING: JWT_SECRET IS MISSING! Using fallback secret.");
  }

  const token = jwt.sign(
    { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    },
    secret,
    { expiresIn: "7d" }
  );
  
  return { 
    token, 
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  };
};

export const authServices = {
  registerUser,
  loginUser
};