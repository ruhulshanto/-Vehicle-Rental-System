"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingsRoutes = void 0;
const express_1 = require("express");
const bookings_controller_1 = require("./bookings.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)("admin", "customer"), bookings_controller_1.bookingsController.createBooking);
router.get("/", (0, auth_1.default)("admin", "customer"), bookings_controller_1.bookingsController.getAllBookings);
router.put("/:bookingId", (0, auth_1.default)("admin", "customer"), bookings_controller_1.bookingsController.updateBooking);
exports.bookingsRoutes = router;
