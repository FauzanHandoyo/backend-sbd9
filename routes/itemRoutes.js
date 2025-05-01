const express = require("express");
const multer = require("multer");
const path = require("path");
const itemController = require("../controllers/itemController");

const router = express.Router();

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: "uploads/", // Store files in the 'uploads' folder
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

const upload = multer({ storage });

// Route for creating an item (expects form-data)
router.post("/create", upload.single("image"), itemController.createItem);
router.get("/", itemController.getAllItems);
router.get("/byId/:id", itemController.getItemById);
router.get("/byStoreId/:store_id", itemController.getItemsByStoreId);
router.put("/", upload.single("image"), itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

module.exports = router;
