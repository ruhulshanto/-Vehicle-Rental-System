# 🚗 Vehicle Rental System API

A complete backend API for vehicle rental management system built with Node.js, TypeScript, Express.js, and PostgreSQL.

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Features](#-features)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Authentication](#-authentication)
- [Business Logic](#-business-logic)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [License](#-license)

## 🎯 Project Overview

A backend API for a vehicle rental management system that handles:

- **Vehicles** - Manage vehicle inventory with availability tracking
- **Customers** - Manage customer accounts and profiles
- **Bookings** - Handle vehicle rentals, returns and cost calculation
- **Authentication** - Secure role-based access control (Admin and Customer roles)

## 🛠️ Technology Stack

- **Backend:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (with Neon DB)
- **Authentication:** JWT + bcrypt
- **Environment:** dotenv
- **Package Manager:** npm

## ✨ Features

- 🔐 JWT-based authentication with role-based access
- 👥 User management (Admin/Customer roles)
- 🚗 Complete vehicle CRUD operations
- 📅 Booking system with automatic price calculation
- 💰 Real-time vehicle availability tracking
- 🛡️ Input validation and error handling
- 📊 PostgreSQL database with proper relations
- 🏗️ Modular and scalable architecture

## 🌐 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/signup` | Public | Register new user account |
| POST | `/api/v1/auth/signin` | Public | Login and receive JWT token |

### 👥 Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users` | Admin only | View all users in the system |
| PUT | `/api/v1/users/:userId` | Admin or Own | Admin: Update any user, Customer: Update own profile |
| DELETE | `/api/v1/users/:userId` | Admin only | Delete user (only if no active bookings) |

### 🚗 Vehicles
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/vehicles` | Admin only | Add new vehicle |
| GET | `/api/v1/vehicles` | Public | View all vehicles |
| GET | `/api/v1/vehicles/:vehicleId` | Public | View specific vehicle details |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin only | Update vehicle details |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin only | Delete vehicle (no active bookings) |

### 📅 Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/bookings` | Customer or Admin | Create booking with auto price calculation |
| GET | `/api/v1/bookings` | Role-based | Admin: All bookings, Customer: Own bookings |
| PUT | `/api/v1/bookings/:bookingId` | Role-based | Customer: Cancel, Admin: Mark as returned |

## 🗃️ Database Schema

### Users Table
| Field | Type | Constraints |
|-------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL, lowercase |
| password | TEXT | NOT NULL, min 6 chars |
| phone | VARCHAR(15) | NOT NULL |
| role | VARCHAR(20) | 'admin' or 'customer' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### Vehicles Table
| Field | Type | Constraints |
|-------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| vehicle_name | VARCHAR(255) | NOT NULL |
| type | VARCHAR(20) | 'car', 'bike', 'van', 'SUV' |
| registration_number | VARCHAR(50) | UNIQUE, NOT NULL |
| daily_rent_price | DECIMAL(10,2) | > 0 |
| availability_status | VARCHAR(20) | 'available' or 'booked' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### Bookings Table
| Field | Type | Constraints |
|-------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| customer_id | INT | REFERENCES users(id) |
| vehicle_id | INT | REFERENCES vehicles(id) |
| rent_start_date | DATE | NOT NULL |
| rent_end_date | DATE | NOT NULL, > rent_start_date |
| total_price | DECIMAL(10,2) | > 0 |
| status | VARCHAR(20) | 'active', 'cancelled', 'returned' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database (or Neon DB account)
- npm or yarn

### Step-by-Step Installation

1. **Clone the repository**
```bash
git clone https://github.com/ruhulshanto/vehicle-rental-system.git
cd vehicle-rental-system
