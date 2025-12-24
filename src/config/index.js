"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: process.env.PORT || 5000,
    connectionString: process.env.CONNECTION_STR || "",
    jwtSecret: process.env.JWT_SECRET,
};
if (!config.jwtSecret || config.jwtSecret.trim() === "") {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined or is empty in environment variables.");
}
exports.default = config;
