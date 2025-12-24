"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingsController = void 0;
const bookings_services_1 = require("./bookings.services");
const createBooking = async (req, res) => {
    try {
        const currentUserId = req.user?.id;
        const currentUserRole = req.user?.role;
        // Customers can only book for themselves
        if (currentUserRole === 'customer') {
            req.body.customer_id = currentUserId;
        }
        const result = await bookings_services_1.bookingsService.createBooking(req.body);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
const getAllBookings = async (req, res) => {
    try {
        const currentUserId = req.user?.id;
        const currentUserRole = req.user?.role || 'customer';
        const result = await bookings_services_1.bookingsService.getAllBookings(currentUserId, currentUserRole);
        const message = currentUserRole === 'admin'
            ? "Bookings retrieved successfully"
            : "Your bookings retrieved successfully";
        res.status(200).json({
            success: true,
            message,
            data: result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId ? parseInt(req.params.bookingId) : NaN;
        if (isNaN(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }
        const currentUserId = req.user?.id;
        const currentUserRole = req.user?.role || 'customer';
        const result = await bookings_services_1.bookingsService.updateBooking(bookingId, req.body, currentUserId, currentUserRole);
        let message = "Booking updated successfully";
        if (req.body.status === 'cancelled') {
            message = "Booking cancelled successfully";
        }
        else if (req.body.status === 'returned') {
            message = "Booking marked as returned. Vehicle is now available";
        }
        res.status(200).json({
            success: true,
            message,
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.bookingsController = {
    createBooking,
    getAllBookings,
    updateBooking
};
