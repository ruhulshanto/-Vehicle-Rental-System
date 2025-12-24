"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const db_1 = require("../../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const registerUser = async (payload) => {
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
    const existingUser = await db_1.pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existingUser.rows.length > 0) {
        throw new Error("User already exists");
    }
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // Create user
    const result = await db_1.pool.query(`INSERT INTO users(name, email, password, phone, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, name, email, phone, role`, [name, email.toLowerCase(), hashedPassword, phone, role]);
    return result.rows[0];
};
const loginUser = async (email, password) => {
    const result = await db_1.pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (result.rows.length === 0) {
        throw new Error("Invalid email or password");
    }
    const user = result.rows[0];
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match) {
        throw new Error("Invalid email or password");
    }
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }, config_1.default.jwtSecret, { expiresIn: "7d" });
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
exports.authServices = {
    registerUser,
    loginUser
};
