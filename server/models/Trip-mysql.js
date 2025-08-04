const { pool } = require('../database');

class Trip {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.fromCity = data.fromCity;
    this.fromCountry = data.fromCountry;
    this.toCity = data.toCity;
    this.toCountry = data.toCountry;
    this.travelDate = data.travelDate;
    this.returnDate = data.returnDate;
    this.serviceFee = data.serviceFee;
    this.currency = data.currency;
    this.notes = data.notes;
    this.baggageCapacity = data.baggageCapacity;
    this.status = data.status;
    this.viewCount = data.viewCount || 0;
    this.requestCount = data.requestCount || 0;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create new trip
  static async create(tripData) {
    const {
      userId, fromCity, fromCountry, toCity, toCountry,
      travelDate, returnDate, serviceFee, currency, notes, baggageCapacity
    } = tripData;
    
    const [result] = await pool.execute(
      `INSERT INTO trips (userId, fromCity, fromCountry, toCity, toCountry, 
       travelDate, returnDate, serviceFee, currency, notes, baggageCapacity) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, fromCity, fromCountry, toCity, toCountry, 
       travelDate, returnDate, serviceFee, currency, notes, baggageCapacity]
    );
    
    return this.findById(result.insertId);
  }

  // Find trip by ID with user info
  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT t.*, 
             u.id as userId, u.name as userName, u.avatar as userAvatar, 
             u.rating as userRating, u.verified as userVerified
      FROM trips t 
      LEFT JOIN users u ON t.userId = u.id 
      WHERE t.id = ?
    `, [id]);
    
    if (rows.length === 0) return null;
    
    const trip = new Trip(rows[0]);
    trip.userId = {
      _id: rows[0].userId,
      name: rows[0].userName,
      avatar: rows[0].userAvatar,
      rating: rows[0].userRating,
      verified: rows[0].userVerified
    };
    
    return trip;
  }

  // Find all trips with filters
  static async find(filters = {}, options = {}) {
    let query = `
      SELECT t.*, 
             u.id as userId, u.name as userName, u.avatar as userAvatar, 
             u.rating as userRating, u.verified as userVerified
      FROM trips t 
      LEFT JOIN users u ON t.userId = u.id 
      WHERE 1=1
    `;
    
    const queryParams = [];
    
    // Add filters
    if (filters.status) {
      query += ' AND t.status = ?';
      queryParams.push(filters.status);
    }
    
    if (filters.userId) {
      query += ' AND t.userId = ?';
      queryParams.push(filters.userId);
    }

    // Add search filters
    if (filters.fromCity) {
      query += ' AND (t.fromCity LIKE ? OR t.fromCountry LIKE ?)';
      queryParams.push(`%${filters.fromCity}%`, `%${filters.fromCity}%`);
    }
    
    if (filters.toCity) {
      query += ' AND (t.toCity LIKE ? OR t.toCountry LIKE ?)';
      queryParams.push(`%${filters.toCity}%`, `%${filters.toCity}%`);
    }

    if (filters.travelDate) {
      query += ' AND t.travelDate >= ?';
      queryParams.push(filters.travelDate);
    }

    // Add sorting
    if (options.sort) {
      const sortField = options.sort.travelDate ? 'travelDate' : 
                       options.sort.serviceFee ? 'serviceFee' : 'createdAt';
      const sortOrder = Object.values(options.sort)[0] === -1 ? 'DESC' : 'ASC';
      query += ` ORDER BY t.${sortField} ${sortOrder}`;
    } else {
      query += ' ORDER BY t.createdAt DESC';
    }

    // Add pagination
    if (options.limit) {
      query += ' LIMIT ?';
      queryParams.push(options.limit);
      
      if (options.skip) {
        query += ' OFFSET ?';
        queryParams.push(options.skip);
      }
    }

    const [rows] = await pool.execute(query, queryParams);
    
    return rows.map(row => {
      const trip = new Trip(row);
      trip.userId = {
        _id: row.userId,
        name: row.userName,
        avatar: row.userAvatar,
        rating: row.userRating,
        verified: row.userVerified
      };
      return trip;
    });
  }

  // Count trips with filters
  static async countDocuments(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM trips WHERE 1=1';
    const queryParams = [];
    
    if (filters.status) {
      query += ' AND status = ?';
      queryParams.push(filters.status);
    }
    
    if (filters.userId) {
      query += ' AND userId = ?';
      queryParams.push(filters.userId);
    }

    const [rows] = await pool.execute(query, queryParams);
    return rows[0].count;
  }

  // Update trip
  static async updateById(id, updateData) {
    const fields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });
    
    if (fields.length === 0) return this.findById(id);
    
    values.push(id);
    await pool.execute(
      `UPDATE trips SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  // Delete trip
  static async deleteById(id) {
    const [result] = await pool.execute('DELETE FROM trips WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Trip;
