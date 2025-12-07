
import dotenv from "dotenv";

dotenv.config();

const config = {
    port : process.env.PORT || 5000,
    connectionString : process.env.CONNECTION_STR || "",
    jwtSecret : process.env.JWT_SECRET || "",
}

export default config;