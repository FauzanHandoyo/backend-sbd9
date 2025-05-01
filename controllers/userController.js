const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const UserController = {
  registerUser: async (req, res) => {
    try {
      console.log("Incoming Request Body:", req.body);
  
      const { name, email, password } = req.body;
  
      // Regex Validations
      const nameRegex = /^[a-zA-Z\s]{3,50}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Missing name, email, or password" });
      }
  
      if (!nameRegex.test(name)) {
        return res.status(400).json({ success: false, message: "Invalid name format. Name should be 3-50 characters long and contain only letters and spaces." });
      }
  
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
      }
  
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ success: false, message: "Invalid password format. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number." });
      }
  
      const existingUser = await UserModel.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already registered" });
      }
  
  
      const hashedPassword = await bcrypt.hash(password, 10); 

      const newUser = await UserModel.createUser(name, email, hashedPassword);
  
      res.status(201).json({
        success: true,
        message: "User created",
        payload: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          password: hashedPassword, // Include hashed password in response
          balance: newUser.balance || 0,
          created_at: newUser.created_at
        }
      });
  
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },
  loginUser: async (req, res) => {
    try {
      console.log("Login Request Body:", req.body);

      const { email, password } = req.body;

      // Validasi input
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Missing email or password" });
      }

      // Cari user berdasarkan email
      const user = await UserModel.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Bandingkan password menggunakan bcrypt.compare
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      // Jika valid, kirim respons sukses
      res.status(200).json({
        success: true,
        message: "Login successful",
        payload: {
          id: user.id,
          name: user.name,
          email: user.email,
          balance: user.balance
        }
      });

    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  getUserByEmail: async (req, res) => {
    try {
      const { email } = req.params;
      console.log("Fetching User by Email:", email);

      if (!email || typeof email !== "string" || email.trim() === "") {
        return res.status(400).json({ success: false, message: "Invalid email" });
      }

      const user = await UserModel.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, payload: { id: user.id, name: user.name, email: user.email, balance: user.balance } });

    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  updateUser: async (req, res) => {
    try {
      console.log("Update Request Body:", req.body);
  
      const { id, name, email, password } = req.body;
  
      // Regex Validations
      const nameRegex = /^[a-zA-Z\s]{3,50}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  
      if (!id || !name || !email || !password) {
        return res.status(400).json({ success: false, message: "Missing id, name, email, or password" });
      }
  
      if (!nameRegex.test(name)) {
        return res.status(400).json({ success: false, message: "Invalid name format. Name should be 3-50 characters long and contain only letters and spaces." });
      }
  
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
      }
  
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ success: false, message: "Invalid password format. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number." });
      }
  

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await UserModel.updateUser(id, name, email, hashedPassword);
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.json({ 
        success: true, 
        message: "User updated successfully", 
        payload: { 
          id: updatedUser.id, 
          name: updatedUser.name, 
          email: updatedUser.email, 
          password: hashedPassword,
          balance: updatedUser.balance || 0, 
          created_at: updatedUser.created_at 
        } 
      });
  
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Deleting User ID:", id);

      // Validate ID
      if (!id || typeof id !== "string" || id.trim() === "") {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid user ID", 
          payload: null 
        });
      }

      // Check if user exists
      const existingUser = await UserModel.getUserById(id);
      if (!existingUser) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found", 
          payload: null 
        });
      }

      // Proceed with deletion
      const deletedUser = await UserModel.deleteUser(id);

      if (!deletedUser) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found", 
          payload: null 
        });
      }

      res.json({ 
        success: true, 
        message: "User deleted successfully", 
        payload: null 
      });

    } catch (err) {
      console.error("Unexpected Server Error:", err);
      res.status(500).json({ 
        success: false, 
        message: "Something went wrong. Please try again.", 
        payload: null 
      });
    }
  },
  topUpBalance: async (req, res) => {
    try {
      const { id, amount } = req.query; // Extract from query parameters

      // Validate input
      if (!id || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID or amount. Amount must be a positive number."
        });
      }

      // Convert amount to a number
      const parsedAmount = parseFloat(amount);

      // Check if user exists
      const existingUser = await UserModel.getUserById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          payload: null
        });
      }

      // Perform top-up
      const updatedUser = await UserModel.topUpBalance(id, parsedAmount);

      // Respond with the updated user details
      res.json({
        success: true,
        message: "Top-up successful",
        payload: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          balance: updatedUser.balance,
          created_at: updatedUser.created_at
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

module.exports = UserController;
