import express, { Request, Response } from "express";
import initDB from "./src/config/db";
import logger from "./src/middleware/logger";
import config from "./src/config";
import { authRoutes } from "./src/modules/auth/auth.routes";
import { usersRoutes } from "./src/modules/users/users.routes";
import { vehiclesRoutes } from "./src/modules/vehicles/vehicles.routes";
import { bookingsRoutes } from "./src/modules/bookings/bookings.routes";

export const app = express();

// Middleware
app.use(express.json());
app.use(logger);

// Initialize database
initDB()
  .then(() => {
    console.log("Database initialized");
  })
  .catch((err) => {
    console.error("Error initializing database:", err);
  });

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Vehicle Rental System API is running",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/bookings", bookingsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Start server
const port = config.port || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}`);
  console.log(`Auth test: POST http://localhost:${port}/api/v1/auth/signup`);
  console.log(`Login test: POST http://localhost:${port}/api/v1/auth/signin`);
});