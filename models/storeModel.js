const pool = require('../db');

const StoreModel = {
  getAllStores: async () => {
    const result = await pool.query('SELECT * FROM stores');
    return result.rows;
  },

  createStore: async (name, address) => {
    const result = await pool.query(
      'INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *',
      [name, address]
    );
    return result.rows[0];
  },

  getStoreById: async (id) => {
    try {
      console.log("Running Query: SELECT * FROM stores WHERE id =", id);

      const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        console.log("No store found with ID:", id);
        return null;
      }

      console.log("Store Found:", result.rows[0]);
      return result.rows[0];
    } catch (err) {
      console.error("Database Error:", err);
      throw err;
    }
  },

  updateStore: async (id, name, address) => {
    try {
      const result = await pool.query(
        'UPDATE stores SET id = $1, name = $2 WHERE address = $3 RETURNING *',
        [name, address, id]
      );

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      console.error("Database Error:", err);
      throw err;
    }
  },

  deleteStore: async (id) => {
    try {
      console.log("Running DELETE Query for Store ID:", id);

      const result = await pool.query('DELETE FROM stores WHERE id = $1 RETURNING *', [id]);

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      console.error("Database Error:", err);
      throw err;
    }
  }
};

module.exports = StoreModel;
