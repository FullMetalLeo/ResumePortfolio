// ==========================================
// Database Configuration File
// ==========================================
// This file handles the connection to our SQLite database.
// SQLite is a file-based database, meaning we don't need to install a separate server.
// It stores all data in a local file named 'users.db'.

const sqlite3 = require('sqlite3').verbose(); // Import the sqlite3 library in verbose mode to see more error details.
const bcrypt = require('bcrypt'); // Import bcrypt to hash passwords securely.

// Create a new database instance.
// If the file 'users.db' does not exist, it will be created automatically.
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        // If there is an error connecting, print it to the console.
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // ==========================================
        // Table Creation: Users
        // ==========================================
        // We create a table named 'users' to store user credentials.
        // columns:
        // - id: Unique identifier for each user (Auto-incremented).
        // - username: The name the user logs in with (Must be unique).
        // - password: The hashed password (NOT the plain text password for security).
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`, (err) => {
            if (err) {
                // If the table already exists or another error occurs, print it.
                // It is safe to ignore "table already exists" errors.
            } else {
                // Table created (or already exists). 
                // We can insert a default test user here if we want.
                // Let's check if the 'user' exists, if not, create one.
                // Username: user, Password: password123 available for testing.
                const insert = 'INSERT INTO users (username, password) VALUES (?,?)';
                const testUser = 'user';
                const testPass = 'password123';
                const saltRounds = 10;

                // Hash the password before storing it.
                bcrypt.hash(testPass, saltRounds, (err, hash) => {
                    if (err) {
                        console.error("Error hashing default password: ", err);
                    } else {
                        // Try to insert the new user. If it fails (e.g., username exists), we ignore it.
                        db.run(insert, [testUser, hash], (err) => {
                            if (err) {
                                // User likely already exists, which is fine.
                            } else {
                                console.log('Default test user created: user / password123');
                            }
                        });
                    }
                });
            }
        });

        // ==========================================
        // Table Creation: Comments
        // ==========================================
        // We create a table named 'comments' to store anonymous messages.
        // columns:
        // - id: Unique identifier.
        // - text: The comment content.
        // - timestamp: When the comment was created (Defaults to current time).
        db.run(`CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Export the database connection so we can use it in 'server.js'.
module.exports = db;
