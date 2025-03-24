"use client";
import RootLayout from "../layout";
import { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const awshost = "http://ec2-51-20-132-235.eu-north-1.compute.amazonaws.com:4000"
    const localhost = "http://localhost:4000";

    const handleLogin = async (e) => {
        e.preventDefault();

        // Send login request to the backend
        try {
        const response = await fetch(`${localhost}/login`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error("Invalid credentials");
        }

        const data = await response.json();
        console.log("Login successful:", data);
        } catch (error) {
        setError(error.message);
        }
    };

    return (
        <div>
            <RootLayout>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                </div>
                <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <button type="submit">Login</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            </RootLayout>
        </div>
    );
};

export default Login;