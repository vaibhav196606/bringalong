const { pool } = require('../database');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.linkedinUrl = data.linkedinUrl;
    this.phone = data.phone;
    this.avatar = data.avatar;
    this.bio = data.bio;
    this.rating = data.rating || 0;
    this.verified = data.verified || false;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create new user
  static async create(userData) {
    const { name, email, password, linkedinUrl, phone } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, linkedinUrl, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, linkedinUrl, phone]
    );
    
    return this.findById(result.insertId);
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  // Update user
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
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Convert to JSON (exclude password)
  toJSON() {
    const { password, ...userObject } = this;
    return userObject;
  }
}

module.exports = User;
