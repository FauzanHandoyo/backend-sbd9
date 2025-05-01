const StoreModel = require('../models/storeModel');
const { body, validationResult } = require('express-validator');


const StoreController = {
  getAllStores: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      const result = await pool.query(
        'SELECT * FROM stores LIMIT $1 OFFSET $2',
        [limit, offset]
      );
  
      res.json({ success: true, message: "Stores found", payload: result.rows });
    } catch (err) {
      console.error("Database Error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  createStore: async (req, res) => {
    try {
      await [
        body('name').notEmpty().withMessage('Name is required'),
        body('address').notEmpty().withMessage('Address is required'),
      ].run(req);
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array() });
      }
  
      const { name, address } = req.body;
      const store = await StoreModel.createStore(name, address);
      res.json({ success: true, message: "Store created", payload: store });
    } catch (err) {
      console.error("Database Error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  getStoreById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Fetching Store ID:", id);

      if (!id || typeof id !== "string" || id.trim() === "") {
        console.log("Invalid Store ID:", id);
        return res.status(400).json({ success: false, message: "Invalid store ID" });
      }

      const store = await StoreModel.getStoreById(id);

      if (!store) {
        console.log("Store Not Found for ID:", id);
        return res.status(404).json({ success: false, message: "Store not found" });
      }

      res.json({ success: true, payload: store });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  updateStore: async (req, res) => {
    console.log("Received Request Body:", req.body);

    const { id, name, address } = req.body;

    if (!id || !name || !address) {
      console.log("Missing Fields - ID:", id, "Name:", name, "Address:", address);
      return res.status(400).json({ success: false, message: "Missing store ID, name, or address" });
    }

    try {
      const updatedStore = await StoreModel.updateStore(id, name, address);

      if (!updatedStore) {
        console.log("Store Not Found with ID:", id);
        return res.status(404).json({ success: false, message: "Store not found" });
      }

      res.json({ success: true, message: "Store updated successfully", payload: updatedStore });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  deleteStore: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Deleting Store ID:", id);

      if (!id || typeof id !== "string" || id.trim() === "") {
        console.log("Invalid Store ID:", id);
        return res.status(400).json({ success: false, message: "Invalid store ID" });
      }

      const deletedStore = await StoreModel.deleteStore(id);

      if (!deletedStore) {
        console.log("Store Not Found for ID:", id);
        return res.status(404).json({ success: false, message: "Store not found" });
      }

      res.json({ success: true, message: "Store deleted successfully" });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};

module.exports = StoreController;
