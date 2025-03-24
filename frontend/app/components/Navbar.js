"use client"; 

import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between">
            <h1 className="text-lg font-bold">MyBank</h1>
            <div className="space-x-4">
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
            <Link href="/account">Account</Link>
            </div>
        </div>
        </nav>
    );
}
