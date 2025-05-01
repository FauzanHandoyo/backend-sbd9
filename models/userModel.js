const pool = require('../db');

const UserModel = {
  createUser: async (name, email, password) => {
    try {
      const result = await pool.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, balance, created_at`,
        [name, email, password]
      );
      return result.rows[0];
    } catch (err) {
      console.error("Database Error:", err);
      throw err;
    }
  },

  getUserByEmail: async (email) => {
    try {
      const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
      return result.rows[0];
    } catch (err) {
      console.error("Database Error:", err);
      throw err;
    }
  },

  getUserById: async (id) => {
    try {
      const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      console.error("Database Error:", err);
      throw err;
    }
  },

  updateUser: async (id, name, email, password) => {
    try {
      const result = await pool.query(
        `UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email, balance, created_at`,
        [name, email, password, id]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      console.error("Database Error:", err);
      throw err;
    }
  },

  deleteUser: async (id) => {
    try {
      const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING id`, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      console.error("Database Error:", err);
      throw err;
    }
  },

  topUpBalance: async (id, amount) => {
    try {
      const result = await pool.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING id, name, email, balance, created_at`,
        [amount, id]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      console.error("Database Error:", err);
      throw err;
    }
  }
};



module.exports = UserModel; 
