import { Router } from "express";
import { bookingsController } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin", "customer"), bookingsController.createBooking);
router.get("/", auth("admin", "customer"), bookingsController.getAllBookings);
router.put("/:bookingId", auth("admin", "customer"), bookingsController.updateBooking);

export const bookingsRoutes = router;