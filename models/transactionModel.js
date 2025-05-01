
const pool = require('../db');

const TransactionModel = {
    createTransaction: async (userId, itemId, quantity, total) => {
      try {
        const result = await pool.query(
          'INSERT INTO transactions (user_id, item_id, quantity, total, status, created_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *',
          [userId, itemId, quantity, total, 'pending']
        );
        return result.rows[0];
      } catch (err) {
        console.error("Database Error:", err);
        throw err;
      }
    },

    updateTransactionStatus: async (transactionId, status) => {
        try {
          const result = await pool.query(
            'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
            [status, transactionId]
          );
          return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
          console.error("Database Error:", err);
          throw err;
        }
    },

    deleteTransaction: async (transactionId) => {
        try {
          const result = await pool.query(
            'DELETE FROM transactions WHERE id = $1 RETURNING *',
            [transactionId]
          );
          return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
          console.error("Database Error:", err);
          throw err;
        }
    },

    getAllTransactions: async () => {
      try {
          const result = await pool.query(
              'SELECT * FROM transactions ORDER BY created_at DESC'
          );
          return result.rows;
      } catch (err) {
          console.error("Database Error:", err);
          throw err;
      }
  }
};

module.exports = TransactionModel;