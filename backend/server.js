// ==========================================
// Server Main Entry Point (server.js)
// ==========================================
// This file sets up the web server using Express.
// It detects requests from the frontend and sends back data.

const express = require('express'); // The web framework we are using.
const cors = require('cors'); // Allows our frontend (Angular) to talk to this backend (different port).
const bodyParser = require('body-parser'); // Helps us read data sent in the "body" of a request (like forms).
const fs = require('fs'); // "File System" - allows us to read files on the computer (for admin.properties).
const path = require('path'); // Helps us work with file paths correctly.
const db = require('./database'); // Import our database connection from database.js.
const bcrypt = require('bcrypt'); // Import bcrypt for checking hashed passwords.

const app = express(); // Initialize the Express application.
const PORT = 3000; // The port our server will listen on.

// ==========================================
// Middleware Configuration
// ==========================================
app.use(cors()); // Enable Cross-Origin Resource Sharing (allows Angular on port 4200 to call us).
app.use(bodyParser.json()); // Tell the app to expect JSON data in requests.

// ==========================================
// Helper Function: Read Admin Properties
// ==========================================
// This function reads the 'admin.properties' file to get the admin credentials.
// It parses lines like "key=value".
function getAdminCredentials() {
    try {
        const filePath = path.join(__dirname, 'admin.properties');
        const data = fs.readFileSync(filePath, 'utf8'); // Read file as text.
        const lines = data.split('\n'); // Split by new lines.
        const creds = {};

        lines.forEach(line => {
            const parts = line.split('=');
            if (parts.length === 2) {
                // Trim whitespace and save to object.
                creds[parts[0].trim()] = parts[1].trim();
            }
        });
        return creds;
    } catch (error) {
        console.error("Could not read admin.properties:", error);
        return null;
    }
}

// ==========================================
// API Route: User Login
// ==========================================
// URL: POST /api/login
// Expects: { "username": "...", "password": "..." }
// Returns: { "success": true/false, "message": "..." }
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Look for the user in the database.
    const sql = "SELECT * FROM users WHERE username = ?";
    db.get(sql, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error" });
        }
        if (!user) {
            // User not found.
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        // Check if the password matches the hash in the database.
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                // Passwords match!
                res.json({ success: true, message: "Login successful", role: "user" });
            } else {
                // Wrong password.
                res.status(401).json({ success: false, message: "Invalid username or password" });
            }
        });
    });
});

// ==========================================
// API Route: Admin Login
// ==========================================
// URL: POST /api/admin-login
// Expects: { "username": "...", "password": "..." }
// Check against admin.properties file.
app.post('/api/admin-login', (req, res) => {
    const { username, password } = req.body;
    const adminCreds = getAdminCredentials();

    if (!adminCreds) {
        return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    // Compare input with values from the file.
    if (username === adminCreds.admin_user && password === adminCreds.admin_pass) {
        res.json({ success: true, message: "Admin login successful", role: "admin" });
    } else {
        res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }
});

// ==========================================
// API Route: Get Comments
// ==========================================
// URL: GET /api/comments
// Returns a list of all comments.
app.get('/api/comments', (req, res) => {
    const sql = "SELECT * FROM comments ORDER BY timestamp DESC"; // Newest first.
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ comments: rows });
    });
});

// ==========================================
// API Route: Post Comment
// ==========================================
// URL: POST /api/comments
// Expects: { "text": "..." }
app.post('/api/comments', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Comment text is required" });
    }

    const sql = "INSERT INTO comments (text) VALUES (?)";
    db.run(sql, [text], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // 'this.lastID' is the ID of the new row.
        res.json({ success: true, id: this.lastID, message: "Comment added" });
    });
});

// ==========================================
// Start Server
// ==========================================
app.listen(PORT, () => {
    console.log(`Server is running heavily on http://localhost:${PORT}`);
    console.log(`Admin routes are secured via file credentials.`);
});
