import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 4000;
const awshost = "http://ec2-51-20-132-235.eu-north-1.compute.amazonaws.com:4000"
const localhost = "http://localhost:4000"

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database
const users = [];
const accounts = [];
const sessions = [];

// Generate one-time password (OTP)
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// Create user (Signup)
app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const id = users.length + 1;
    users.push({ id, username, password });
    accounts.push({ id, userId: id, amount: 0 });

    res.status(201).json({ message: "User created", userId: id });
});

// Login user
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
        }
    
        const token = generateOTP();
        sessions.push({ userId: user.id, token });
    
        res.json({ message: "Login successful", token });  // Respond with success and token after login
    });
    

// Get account balance
app.post("/me/accounts", (req, res) => {
    const { token } = req.body;
    const session = sessions.find((s) => s.token === token);

    if (!session) {
        return res.status(403).json({ message: "Invalid session" });
    }

    const account = accounts.find((a) => a.userId === session.userId);
    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    res.json({ balance: account.amount });
});

// Deposit money
app.post("/me/accounts/transactions", (req, res) => {
    const { token, amount } = req.body;
    const session = sessions.find((s) => s.token === token);

    if (!session) {
        return res.status(403).json({ message: "Invalid session" });
    }

    const account = accounts.find((a) => a.userId === session.userId);
    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    account.amount += amount;
    res.json({ message: "Deposit successful", balance: account.amount });
});

// Start server
app.listen(port, () => {
    console.log(`Bank backend running at ${localhost} and port ${port}`);
    console.log(`Bank backend running at ${localhost}`);
});
