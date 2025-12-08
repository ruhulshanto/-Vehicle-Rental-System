import express, { Request, Response } from "express";
import initDB from "./src/config/db";
import logger from "./src/middleware/logger";
import { authRoutes } from "./src/modules/auth/auth.routes";
import { usersRoutes } from "./src/modules/users/users.routes";
import { vehiclesRoutes } from "./src/modules/vehicles/vehicles.routes";
import { bookingsRoutes } from "./src/modules/bookings/bookings.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(logger);

// Initialize database
initDB()
  .then(() => {
    console.log("Database initialized");
  })
  .catch((err) => {
    console.error("DB error:", err);
  });

// Health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Vehicle Rental System API is running",
  });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/bookings", bookingsRoutes);

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
module.exports = app;