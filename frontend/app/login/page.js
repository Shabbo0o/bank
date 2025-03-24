"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import RootLayout from "../layout";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();


        const awshost = "http://ec2-51-20-132-235.eu-north-1.compute.amazonaws.com:4000"
        const localhost = "http://localhost:4000";

        try {
            const response = await fetch(localhost + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
    
            const text = await response.text(); // Get raw response
            console.log("Raw response:", text); // Log raw response to debug
    
            const data = JSON.parse(text); // Parse JSON manually
    
            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("Login successful! Redirecting...");
                router.push("/account");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Login failed. Please check the console for details.");
        }
    };
    
    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleLogin} className="bg-white shadow-md rounded-lg p-8 w-80 flex flex-col gap-4">
                
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required 
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                
                <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition">
                Log In
                </button>
            </form>
        </>
    );
}
