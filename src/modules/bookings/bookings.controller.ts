import { Request, Response } from "express";
import { bookingsService } from "./bookings.services";

const createBooking = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;
    
    // Customers can only book for themselves
    if (currentUserRole === 'customer') {
      req.body.customer_id = currentUserId;
    }
    
    const result = await bookingsService.createBooking(req.body);
    
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role || 'customer';
    
    const result = await bookingsService.getAllBookings(currentUserId, currentUserRole);
    
    const message = currentUserRole === 'admin' 
      ? "Bookings retrieved successfully" 
      : "Your bookings retrieved successfully";
    
    res.status(200).json({
      success: true,
      message,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
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
    
    const result = await bookingsService.updateBooking(
      bookingId, 
      req.body, 
      currentUserId, 
      currentUserRole
    );
    
    let message = "Booking updated successfully";
    if (req.body.status === 'cancelled') {
      message = "Booking cancelled successfully";
    } else if (req.body.status === 'returned') {
      message = "Booking marked as returned. Vehicle is now available";
    }
    
    res.status(200).json({
      success: true,
      message,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const bookingsController = {
  createBooking,
  getAllBookings,
  updateBooking
};