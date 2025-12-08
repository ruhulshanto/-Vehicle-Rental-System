import { pool } from "../../config/db";

const createVehicle = async (payload: any) => {
  const { 
    vehicle_name, 
    type, 
    registration_number, 
    daily_rent_price, 
    availability_status = 'available' 
  } = payload;
  
  // Check if registration number exists
  const existingVehicle = await pool.query(
    "SELECT * FROM vehicles WHERE registration_number = $1",
    [registration_number]
  );
  
  if (existingVehicle.rows.length > 0) {
    throw new Error("Vehicle with this registration number already exists");
  }
  
  const result = await pool.query(
    `INSERT INTO vehicles(
      vehicle_name, type, registration_number, 
      daily_rent_price, availability_status
    ) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id, vehicle_name, type, registration_number, 
              daily_rent_price, availability_status`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );
  
  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, 
            daily_rent_price, availability_status 
     FROM vehicles 
     ORDER BY id`
  );
  return result.rows;
};

const getVehicleById = async (vehicleId: number) => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, 
            daily_rent_price, availability_status 
     FROM vehicles 
     WHERE id = $1`,
    [vehicleId]
  );
  
  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  
  return result.rows[0];
};

const updateVehicle = async (vehicleId: number, payload: any) => {
  const { 
    vehicle_name, type, registration_number, 
    daily_rent_price, availability_status 
  } = payload;
  
  const updates = [];
  const values = [];
  let index = 1;
  
  if (vehicle_name) {
    updates.push(`vehicle_name = $${index}`);
    values.push(vehicle_name);
    index++;
  }
  
  if (type) {
    updates.push(`type = $${index}`);
    values.push(type);
    index++;
  }
  
  if (registration_number) {
    // Check if registration number already exists for another vehicle
    const regCheck = await pool.query(
      "SELECT id FROM vehicles WHERE registration_number = $1 AND id != $2",
      [registration_number, vehicleId]
    );
    
    if (regCheck.rows.length > 0) {
      throw new Error("Registration number already in use");
    }
    
    updates.push(`registration_number = $${index}`);
    values.push(registration_number);
    index++;
  }
  
  if (daily_rent_price) {
    if (daily_rent_price <= 0) {
      throw new Error("Daily rent price must be positive");
    }
    updates.push(`daily_rent_price = $${index}`);
    values.push(daily_rent_price);
    index++;
  }
  
  if (availability_status) {
    updates.push(`availability_status = $${index}`);
    values.push(availability_status);
    index++;
  }
  
  updates.push(`updated_at = NOW()`);
  
  if (updates.length === 0) {
    throw new Error("No fields to update");
  }
  
  values.push(vehicleId);
  
  const query = `
    UPDATE vehicles 
    SET ${updates.join(', ')}
    WHERE id = $${index}
    RETURNING id, vehicle_name, type, registration_number, 
              daily_rent_price, availability_status
  `;
  
  const result = await pool.query(query, values);
  
  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  
  return result.rows[0];
};

const deleteVehicle = async (vehicleId: number) => {
  // Check for active bookings
  const activeBookings = await pool.query(
    `SELECT id FROM bookings 
     WHERE vehicle_id = $1 AND status = 'active'`,
    [vehicleId]
  );
  
  if (activeBookings.rows.length > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }
  
  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 RETURNING id`,
    [vehicleId]
  );
  
  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  
  return true;
};

export const vehiclesService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};