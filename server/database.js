const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'traveler_connect',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
const initializeTables = async () => {
  try {
    // Users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        linkedinUrl VARCHAR(500),
        phone VARCHAR(20),
        avatar VARCHAR(500),
        bio TEXT,
        rating DECIMAL(3,2) DEFAULT 0.00,
        verified BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Trips table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS trips (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        userId VARCHAR(36) NOT NULL,
        fromCity VARCHAR(255) NOT NULL,
        fromCountry VARCHAR(255) NOT NULL,
        toCity VARCHAR(255) NOT NULL,
        toCountry VARCHAR(255) NOT NULL,
        travelDate DATE NOT NULL,
        returnDate DATE,
        serviceFee DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        notes TEXT,
        baggageCapacity VARCHAR(255),
        status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
        viewCount INT DEFAULT 0,
        requestCount INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Requests table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS requests (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        tripId VARCHAR(36) NOT NULL,
        requesterId VARCHAR(36) NOT NULL,
        itemDescription TEXT NOT NULL,
        estimatedSize VARCHAR(255),
        urgency ENUM('low', 'medium', 'high') DEFAULT 'medium',
        maxBudget DECIMAL(10,2),
        deliveryLocation VARCHAR(255),
        status ENUM('pending', 'accepted', 'in-transit', 'completed', 'cancelled') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tripId) REFERENCES trips(id) ON DELETE CASCADE,
        FOREIGN KEY (requesterId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize tables:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  initializeTables
};
