const itemModel = require("../models/itemModel");
const pool = require("../db");

exports.createItem = async (req, res) => {
  try {
    const { name, price, store_id, stock } = req.body;

    console.log("Received form-data:", req.body); // Debugging output

    // Ensure required fields are present
    if (!name || !price || !store_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the store exists
    const storeCheck = await pool.query("SELECT * FROM stores WHERE id = $1", [store_id]);
    if (storeCheck.rows.length === 0) {
      return res.status(400).json({ error: "Store ID does not exist" });
    }

    // Get uploaded file name (if exists)
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Insert item into database
    const item = await itemModel.createItem(name, price, store_id, stock || 0, image);
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await itemModel.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    // Get item from database
    const item = await itemModel.getItemById(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemsByStoreId = async (req, res) => {
  try {
    const { store_id } = req.params;

    // Validate store ID
    if (!store_id) {
      return res.status(400).json({ error: "Store ID is required" });
    }

    // Get items from database
    const items = await itemModel.getItemsByStoreId(store_id);

    if (items.length === 0) {
      return res.status(404).json({ error: "No items found for this store" });
    }

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id, name, price, store_id, stock } = req.body;

    console.log("Received form-data:", req.body); // Debugging output

    // Ensure required fields are present
    if (!id || !name || !price || !store_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get uploaded file name (if exists)
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Update item in database
    const item = await itemModel.updateItem(id, name, price, store_id, stock || 0, image_url);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    // Delete item from database
    const item = await itemModel.deleteItem(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully", item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

