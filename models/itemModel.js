const pool = require("../db");


const createItem = async (name, price, store_id, stock, image_url) => {
  try {
    const result = await pool.query(
      `INSERT INTO items (name, price, store_id, stock, image_url) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, price, store_id, stock, image_url]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating item: ${error.message}`);
  }
};


const getAllItems = async () => {
  try {
    const result = await pool.query(
      `SELECT items.*, stores.name AS store_name 
       FROM items 
       JOIN stores ON items.store_id = stores.id 
       ORDER BY items.created_at DESC`
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching items: ${error.message}`);
  }
};

const getItemById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT items.*, stores.name AS store_name 
       FROM items 
       JOIN stores ON items.store_id = stores.id 
       WHERE items.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error fetching item: ${error.message}`);
  }
};

const getItemsByStoreId = async (store_id) => {
  try {
    const result = await pool.query(
      `SELECT items.*, stores.name AS store_name 
       FROM items 
       JOIN stores ON items.store_id = stores.id 
       WHERE items.store_id = $1
       ORDER BY items.created_at DESC`,
      [store_id]
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching items: ${error.message}`);
  }
};

const updateItem = async (id, name, price, store_id, stock, image_url) => {
  try {
    const result = await pool.query(
      `UPDATE items 
       SET name = $1, price = $2, store_id = $3, stock = $4, image_url = COALESCE($5, image_url) 
       WHERE id = $6 RETURNING *`,
      [name, price, store_id, stock, image_url, id]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error updating item: ${error.message}`);
  }
};

const deleteItem = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error deleting item: ${error.message}`);
  }
};


module.exports = { createItem, getAllItems, getItemById, getItemsByStoreId, updateItem, deleteItem };
