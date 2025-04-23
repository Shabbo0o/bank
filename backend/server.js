import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 4000;

let connection;

// Function to connect to MySQL database
async function connectDB() {
    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "Shabboo#123",
            database: "bank",
            authPlugins: {
                mysql_clear_password: () => () => Buffer.from("5S182vt2"),
            },
        });
        console.log("✅ Connected to MySQL database");
        return connection;
    } catch (err) {
        console.error("❌ Error connecting to MySQL:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// const db = await connectDB();

const pool = mysql.createPool({
    user: "root",
    password: "Shabboo#123",
    host: "localhost",
    database: "bank",
    port: 3306, //????? 8889
});

// Query function to run SQL queries
async function query(sql, params) {
    const [results] = await pool.execute(sql, params);
    return results;
}

// Check if the user already exists
const sql = "SELECT * FROM users WHERE username = ?";
const params = ["user"];
const existingUser = await query(sql, params);

if (existingUser.length === 0) {
    const insertSQL = "INSERT INTO users (username, password) VALUES (?, ?)";
    const insertParams = ["user", "123"];
    const result = await query(insertSQL, insertParams);
    console.log("User inserted:", result);
} else {
    console.log("User already exists, skipping insert.");
}

// Middleware
// const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

// Generate OTP (temporary token)
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    try {
        const [result] = await pool.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, password]
        );

        res.status(201).json({ message: "User created", userId: result.insertId });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login - Authenticate user
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.execute(
            "SELECT id, password FROM users WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = rows[0];

    if (password !== user.password) {
    return res.status(401).json({ message: "Invalid credentials" });
}

        console.log("User data from DB:", user);

        const token = generateOTP();
        await pool.execute("INSERT INTO sessions (user_id, token) VALUES (?, ?)", [
            user.id,
            token,
        ]);

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get account balance
app.post("/me/accounts", async (req, res) => {
    const { token } = req.body;
    console.log("Received token:", token);
    if (!token) {
        return res.status(400).json({ message: "Token is missing" });
    }
    else { console.log("Token:", token); }
    
    try {
        const [sessionRows] = await pool.execute(
            "SELECT user_id FROM sessions WHERE token = ?",
            [token]
        );

        console.log("Session rows:", sessionRows);

        if (sessionRows.length === 0) {
            return res.status(403).json({ message: "Invalid session" });
        }

        const userId = sessionRows[0].user_id;
        console.log("User ID from session:", userId);
        const [accountRows] = await pool.execute(
            "SELECT amount FROM accounts WHERE user_id = ?",
            [userId]
        );
        console.log("Account rows:", accountRows);
        var tempBalance = 0;

        // if (accountRows.length === 0) {
        //     return res.status(404).json({ message: "Account not found" });
        // }
        if (accountRows.length !== 0) {
            tempBalance = accountRows[0].amount;
        }

        res.json({ balance: tempBalance });
    } catch (error) {
        console.error("Balance check error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});




app.post("/me/accounts/transactions", async (req, res) => {
    const { token, amount } = req.body;

    // Ensure the required parameters are provided
    if (!token || amount === undefined) {
        return res.status(400).json({ message: "Token and amount are required" });
    }

    try {
        console.log("Token:", token, "Amount:", amount); // Check the incoming values

        // Get the user session based on the token
        const [sessionRows] = await pool.execute(
            "SELECT user_id FROM sessions WHERE token = ?",
            [token]
        );

        if (sessionRows.length === 0) {
            return res.status(403).json({ message: "Invalid session" });
        }

        const userId = sessionRows[0].user_id;

        // insert a zero balance account
        await pool.execute(
            "INSERT INTO accounts (user_id, amount, created_at) VALUES (?, ?, ?)",
            [userId, 0, new Date()]
        );


        // Get the account associated with this user
        const [accountRows] = await pool.execute(
            "SELECT id, amount FROM accounts WHERE user_id = ?",
            [userId]
        );

        // if (accountRows.length === 0) {
        //     return res.status(404).json({ message: "Account not found" });
        // }

        const account = accountRows[0];

        // Ensure amount is a valid number and positive
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: "Invalid deposit amount" });
        }

        // Calculate the new balance after the deposit
        const newBalance = account.amount + amount;

        // Insert the transaction into the transactions table
        await pool.execute(
            "INSERT INTO transactions (account_id, transaction_type, amount, balance_after) VALUES (?, ?, ?, ?)",
            [account.id, 'deposit', amount, newBalance]
        );

        // Update the account balance
        await pool.execute(
            // "UPDATE accounts SET amount = ? WHERE id = ?",
            // [newBalance, account.id]
            "UPDATE accounts SET amount = amount + ? WHERE id = ?",
            [amount, account.id]
        );

        res.json({ message: "Deposit successful", amount,newBalance });
    } catch (error) {
        console.error("Deposit error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Start server after DB connection
const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();
