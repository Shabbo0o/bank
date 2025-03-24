
"use client";
import { useState, useEffect } from "react";

export default function Account() {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const awshost = "http://ec2-51-20-132-235.eu-north-1.compute.amazonaws.com:4000";
    const localhost = "http://localhost:4000";

    useEffect(() => {
        fetch(`${localhost}/me/accounts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: localStorage.getItem("token") }),
        })
        .then((res) => res.json())
        .then((data) => setBalance(data.balance));
    }, []);

    const handleDeposit = async () => {
        await fetch(`${localhost}/me/accounts/transactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: localStorage.getItem("token"), amount: parseInt(amount) }),
        });

        setBalance((prev) => prev + parseInt(amount));
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Balance: {balance} SEK</h1>
            <div className="bg-white p-6 rounded-lg shadow-md w-80">
                <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full p-2 mb-2 border rounded"
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={handleDeposit} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                    Deposit
                </button>
            </div>
        </div>
    );
}
