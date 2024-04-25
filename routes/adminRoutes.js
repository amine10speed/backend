const express = require('express');
const db = require('../database'); // Adjust this path to the actual location of your database connection module
const bcrypt = require('bcrypt');

const router = express.Router();

// CREATE - Add a new admin
router.post('/admin', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO admin (email, password, username) VALUES (?, ?, ?)';
    db.query(query, [email, hashedPassword, username], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error adding admin', error: err });
      }
      res.status(201).json({ message: 'Admin created successfully', id: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// READ - Get all admins
router.get('/admin', (req, res) => {
  const query = 'SELECT * FROM admin';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching admins', error: err });
    }
    // Don't send password hashes to the client for security reasons
    const sanitizedResults = results.map(({ password, ...rest }) => rest);
    res.status(200).json(sanitizedResults);
  });
});

// UPDATE - Update an admin's details
router.put('/admin/:id', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'UPDATE admin SET email = ?, password = ?, username = ? WHERE id_ad = ?';
    db.query(query, [email, hashedPassword, username, req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating admin', error: err });
      }
      res.status(200).json({ message: 'Admin updated successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE - Remove an admin
router.delete('/admin/:id', (req, res) => {
  const query = 'DELETE FROM admin WHERE id_ad = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting admin', error: err });
    }
    res.status(200).json({ message: 'Admin deleted successfully' });
  });
});

// LOGIN - Authenticate an admin
router.post('/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      // Select only the necessary fields, exclude the password
      const query = 'SELECT id_ad, email, username, password FROM admin WHERE email = ?';
      
      db.query(query, [email], async (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error logging in', error: err.message });
        }
        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
        const admin = results[0];
        
        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // Here you should generate and send a session token or JWT instead
        // of sending admin details directly
        // For example:
        // const token = generateToken(admin.id_ad);
        // res.status(200).json({ message: 'Login successful', token: token });
  
        // Send back only non-sensitive data
        res.status(200).json({
            status: 'ok', // Use "status" here instead of "message"
            admin: {
              id: admin.id_ad,
              email: admin.email,
              username: admin.username
            }
          });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
module.exports = router;
