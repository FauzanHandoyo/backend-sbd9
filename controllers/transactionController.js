
const TransactionModel = require('../models/transactionModel');
const pool = require('../db'); 

const TransactionController = {
  createTransaction: async (req, res) => {
    try {
      const { item_id, quantity, user_id } = req.body;

      // Validate input
      if (!item_id || !quantity || !user_id || typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid item ID, user ID, or quantity. Quantity must be a positive number."
        });
      }

      // Fetch the item price from the database
      const itemResult = await pool.query('SELECT price FROM items WHERE id = $1', [item_id]);
      if (itemResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Item not found"
        });
      }

      const itemPrice = itemResult.rows[0].price;
      const total = itemPrice * quantity; // Calculate total based on item price and quantity

      // Create the transaction
      const transaction = await TransactionModel.createTransaction(user_id, item_id, quantity, total);

      if (!transaction) {
        return res.status(500).json({
          success: false,
          message: "Failed to create transaction"
        });
      }

      // Respond with the transaction details
      res.json({
        success: true,
        message: "Transaction created",
        payload: {
          id: transaction.id,
          user_id: transaction.user_id,
          item_id: transaction.item_id,
          quantity: transaction.quantity,
          total: transaction.total,
          status: transaction.status,
          created_at: transaction.created_at.toISOString()
        }
      });

    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  },

  payTransaction: async (req, res) => {
    try {
      const { id } = req.params; // Extract transaction ID from URL parameters

      // Validate input
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Invalid transaction ID"
        });
      }

      // Update the transaction status to 'paid'
      const updatedTransaction = await TransactionModel.updateTransactionStatus(id, 'paid');

      if (!updatedTransaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found"
        });
      }

      // Respond with the updated transaction details
      res.json({
        success: true,
        message: "Payment successful",
        payload: {
          id: updatedTransaction.id,
          user_id: updatedTransaction.user_id,
          item_id: updatedTransaction.item_id,
          quantity: updatedTransaction.quantity,
          total: updatedTransaction.total,
          status: updatedTransaction.status,
          created_at: updatedTransaction.created_at.toISOString()
        }
      });

    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  },
  deleteTransaction: async (req, res) => {
    try {
      const { id } = req.params; // Extract transaction ID from URL parameters

      // Validate input
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Invalid transaction ID"
        });
      }

      // Delete the transaction
      const deletedTransaction = await TransactionModel.deleteTransaction(id);

      if (!deletedTransaction) {
        return res.status(404).json({
          success: false,
          message: "Transaction not found"
        });
      }

      // Respond with the deleted transaction details
      res.json({
        success: true,
        message: "Transaction deleted",
        payload: {
          id: deletedTransaction.id,
          user_id: deletedTransaction.user_id,
          item_id: deletedTransaction.item_id,
          quantity: deletedTransaction.quantity,
          total: deletedTransaction.total,
          status: deletedTransaction.status,
          created_at: deletedTransaction.created_at.toISOString()
        }
      });

    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  },
  // Pagination di getAllTransactions
  getAllTransactions: async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const offset = (page - 1) * limit;

        const result = await pool.query(
            'SELECT * FROM transactions ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        const transactions = result.rows;

        if (transactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No transactions found"
            });
        }

        // Count total transactions for pagination metadata
        const totalCountResult = await pool.query('SELECT COUNT(*) FROM transactions');
        const totalCount = parseInt(totalCountResult.rows[0].count);

        res.json({
            success: true,
            message: "Transactions retrieved successfully",
            payload: {
                data: transactions.map(transaction => ({
                    id: transaction.id,
                    user_id: transaction.user_id,
                    item_id: transaction.item_id,
                    quantity: transaction.quantity,
                    total: transaction.total,
                    status: transaction.status,
                    created_at: transaction.created_at.toISOString()
                })),
                pagination: {
                    page,
                    limit,
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / limit)
                }
            }
        });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
  },
};

module.exports = TransactionController;