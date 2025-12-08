import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users ORDER BY id`
  );
  return result.rows;
};

const updateUser = async (userId: number, payload: any, currentUserRole: string) => {
  const { name, email, phone, role } = payload;
  
  // Regular customers cannot change role
  if (currentUserRole !== 'admin' && role) {
    throw new Error("Only admin can change user roles");
  }
  
  const updates = [];
  const values = [];
  let index = 1;
  
  if (name) {
    updates.push(`name = $${index}`);
    values.push(name);
    index++;
  }
  
  if (email) {
    // Check if email already exists for another user
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email.toLowerCase(), userId]
    );
    
    if (emailCheck.rows.length > 0) {
      throw new Error("Email already in use");
    }
    
    updates.push(`email = $${index}`);
    values.push(email.toLowerCase());
    index++;
  }
  
  if (phone) {
    updates.push(`phone = $${index}`);
    values.push(phone);
    index++;
  }
  
  if (role && currentUserRole === 'admin') {
    updates.push(`role = $${index}`);
    values.push(role);
    index++;
  }
  
  updates.push(`updated_at = NOW()`);
  
  if (updates.length === 0) {
    throw new Error("No fields to update");
  }
  
  values.push(userId);
  
  const query = `
    UPDATE users 
    SET ${updates.join(', ')}
    WHERE id = $${index}
    RETURNING id, name, email, phone, role
  `;
  
  const result = await pool.query(query, values);
  
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  
  return result.rows[0];
};

const deleteUser = async (userId: number) => {
  // Check for active bookings
  const activeBookings = await pool.query(
    `SELECT id FROM bookings 
     WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );
  
  if (activeBookings.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }
  
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [userId]
  );
  
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  
  return true;
};

export const usersService = {
  getAllUsers,
  updateUser,
  deleteUser
};