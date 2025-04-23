"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Account() {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true); // Track loading state
    const router = useRouter();

    const awshost = "http://ec2-51-20-132-235.eu-north-1.compute.amazonaws.com:4000";
    const localhost = "http://localhost:4000";
    // console.log("Localhost:", localhost);
    console.log("Token-account page is:");
    useEffect(() => {

        // Wait for token to be available
        const token = localStorage.getItem("token");
        console.log("Token-account page is:", token);
        if (token) {
            fetch(`http://localhost:4000/me/accounts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            })
            .then((res) => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(`Error ${res.status}: ${text}`) });
                }
                else return res.json();
            })
            .then((data) => {
                    console.log("Account balance data:", data);
                    setBalance(data.balance);
                    setLoading(false); // Stop loading once data is received
                })
            .catch((error) => {
                    console.error("Error fetching account balance:", error);
                    alert("Failed to fetch balance");
                    setLoading(false);
            });
        } else {
            alert("Token not found, please login again.");
            router.push("/login"); // Redirect to login if no token
        }
    }, [localhost, router]);

    const handleDeposit = async () => {
        const amountToDeposit = parseFloat(amount);
        if (isNaN(amountToDeposit) || amountToDeposit <= 0) {
            alert("Please enter a valid deposit amount.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${localhost}/me/accounts/transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, amount: amountToDeposit }),
            });

            if (response.ok) {
                setBalance((prev) => prev + amountToDeposit); // Update balance after deposit
                // setAmount(""); // Clear amount input
            } else {
                const data = await response.json();
                alert(data.message || "Deposit failed");
            }
        } catch (error) {
            console.error("Deposit error:", error);
            alert("Error during deposit. Please try again.");
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Show loading message while fetching balance
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Balance: {balance} SEK</h1>
            <div className="bg-white p-6 rounded-lg shadow-md w-80">
                <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full p-2 mb-2 border rounded"
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                />
                <button
                    onClick={handleDeposit}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                    Deposit
                </button>
            </div>
        </div>
    );
}
