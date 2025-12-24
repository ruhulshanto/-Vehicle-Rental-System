
import dotenv from "dotenv";

dotenv.config();

const config = {
    port : process.env.PORT || 5000,
    connectionString : process.env.CONNECTION_STR || "",
    jwtSecret : process.env.JWT_SECRET,
}

if (!config.jwtSecret || config.jwtSecret.trim() === "") {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined or is empty in environment variables.");
}

export default config;