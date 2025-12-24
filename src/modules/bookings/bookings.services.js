"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingsService = void 0;
const db_1 = require("../../config/db");
const createBooking = async (payload) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    // Validate dates
    const startDate = new Date(rent_start_date);
    const endDate = new Date(rent_end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
        throw new Error("Start date cannot be in the past");
    }
    if (endDate <= startDate) {
        throw new Error("End date must be after start date");
    }
    // Check vehicle availability
    const vehicleResult = await db_1.pool.query(`SELECT id, vehicle_name, daily_rent_price, availability_status 
     FROM vehicles WHERE id = $1`, [vehicle_id]);
    if (vehicleResult.rows.length === 0) {
        throw new Error("Vehicle not found");
    }
    const vehicle = vehicleResult.rows[0];
    if (vehicle.availability_status !== 'available') {
        throw new Error("Vehicle is not available for booking");
    }
    // Check customer exists
    const customerResult = await db_1.pool.query(`SELECT id FROM users WHERE id = $1`, [customer_id]);
    if (customerResult.rows.length === 0) {
        throw new Error("Customer not found");
    }
    // Calculate number of days and total price
    const timeDiff = endDate.getTime() - startDate.getTime();
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalPrice = numberOfDays * vehicle.daily_rent_price; // Already parsed by db.ts
    // Start transaction
    const client = await db_1.pool.connect();
    try {
        await client.query('BEGIN');
        // Create booking
        const bookingResult = await client.query(`INSERT INTO bookings(
        customer_id, vehicle_id, rent_start_date, rent_end_date, total_price
      ) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]);
        // Update vehicle status to "booked"
        await client.query(`UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`, [vehicle_id]);
        await client.query('COMMIT');
        const booking = bookingResult.rows[0];
        return {
            id: booking.id,
            customer_id: booking.customer_id,
            vehicle_id: booking.vehicle_id,
            rent_start_date: booking.rent_start_date.toISOString().split('T')[0], // "2024-01-15"
            rent_end_date: booking.rent_end_date.toISOString().split('T')[0], // "2024-01-20"
            total_price: booking.total_price,
            status: booking.status,
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: vehicle.daily_rent_price
            }
        };
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
};
const getAllBookings = async (currentUserId, currentUserRole) => {
    if (currentUserRole === 'admin') {
        // Admin view: all bookings with customer and vehicle details
        const result = await db_1.pool.query(`SELECT 
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        u.name as customer_name,
        u.email as customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.created_at DESC`);
        return result.rows.map(booking => ({
            id: booking.id,
            customer_id: booking.customer_id,
            vehicle_id: booking.vehicle_id,
            rent_start_date: booking.rent_start_date.toISOString().split('T')[0],
            rent_end_date: booking.rent_end_date.toISOString().split('T')[0],
            total_price: booking.total_price,
            status: booking.status,
            customer: {
                name: booking.customer_name,
                email: booking.customer_email
            },
            vehicle: {
                vehicle_name: booking.vehicle_name,
                registration_number: booking.registration_number
            }
        }));
    }
    else {
        // Customer view: only own bookings
        const result = await db_1.pool.query(`SELECT 
        b.id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        v.vehicle_name,
        v.registration_number,
        v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.created_at DESC`, [currentUserId]);
        return result.rows.map(booking => ({
            id: booking.id,
            vehicle_id: booking.vehicle_id,
            rent_start_date: booking.rent_start_date.toISOString().split('T')[0],
            rent_end_date: booking.rent_end_date.toISOString().split('T')[0],
            total_price: booking.total_price,
            status: booking.status,
            vehicle: {
                vehicle_name: booking.vehicle_name,
                registration_number: booking.registration_number,
                type: booking.type
            }
        }));
    }
};
const updateBooking = async (bookingId, payload, currentUserId, currentUserRole) => {
    const { status } = payload;
    if (!status || !['cancelled', 'returned'].includes(status)) {
        throw new Error("Invalid status. Allowed: 'cancelled' or 'returned'");
    }
    // Get booking details with vehicle info.
    const bookingResult = await db_1.pool.query(`SELECT b.*, v.availability_status 
     FROM bookings b
     JOIN vehicles v ON b.vehicle_id = v.id
     WHERE b.id = $1`, [bookingId]);
    if (bookingResult.rows.length === 0) {
        throw new Error("Booking not found");
    }
    const booking = bookingResult.rows[0];
    // Check permissions
    if (currentUserRole === 'customer') {
        // Customers can only cancel their own bookings
        if (booking.customer_id !== currentUserId) {
            throw new Error("You can only update your own bookings");
        }
        // Customers can only cancel, not mark as returned
        if (status !== 'cancelled') {
            throw new Error("Customers can only cancel bookings");
        }
        // Check if booking can be cancelled (before start date)
        const today = new Date();
        const startDate = new Date(booking.rent_start_date);
        if (today >= startDate) {
            throw new Error("Cannot cancel booking after start date");
        }
    }
    const client = await db_1.pool.connect();
    try {
        await client.query('BEGIN');
        // Update booking status
        const updateResult = await client.query(`UPDATE bookings 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`, [status, bookingId]);
        // If booking is cancelled or returned, make vehicle available
        if (status === 'cancelled' || status === 'returned') {
            await client.query(`UPDATE vehicles 
         SET availability_status = 'available' 
         WHERE id = $1`, [booking.vehicle_id]);
        }
        await client.query('COMMIT');
        const updatedBooking = updateResult.rows[0];
        const response = {
            id: updatedBooking.id,
            customer_id: updatedBooking.customer_id,
            vehicle_id: updatedBooking.vehicle_id,
            rent_start_date: updatedBooking.rent_start_date.toISOString().split('T')[0],
            rent_end_date: updatedBooking.rent_end_date.toISOString().split('T')[0],
            total_price: updatedBooking.total_price,
            status: updatedBooking.status
        };
        if (status === 'returned') {
            response.vehicle = {
                availability_status: 'available'
            };
        }
        return response;
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
};
exports.bookingsService = {
    createBooking,
    getAllBookings,
    updateBooking
};
