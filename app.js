"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./src/config/db"));
const logger_1 = __importDefault(require("./src/middleware/logger"));
const auth_routes_1 = require("./src/modules/auth/auth.routes");
const users_routes_1 = require("./src/modules/users/users.routes");
const vehicles_routes_1 = require("./src/modules/vehicles/vehicles.routes");
const bookings_routes_1 = require("./src/modules/bookings/bookings.routes");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(logger_1.default);
// Initialize database
(0, db_1.default)()
    .then(() => {
    console.log("Database initialized");
})
    .catch((err) => {
    console.error("DB error:", err);
});
// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Vehicle Rental System API is running",
    });
});
// Routes
app.use("/api/v1/auth", auth_routes_1.authRoutes);
app.use("/api/v1/users", users_routes_1.usersRoutes);
app.use("/api/v1/vehicles", vehicles_routes_1.vehiclesRoutes);
app.use("/api/v1/bookings", bookings_routes_1.bookingsRoutes);
// 404
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});
// Export for Vercel
exports.default = app;
