"use client";
import Link from "next/link";

export default function Home() {
    return (
        <div>
        <nav>
            <Link href="/">Home</Link> | <Link href="/login">Login</Link> | <Link href="/signup">Create User</Link>
        </nav>
        <h1>Welcome to the Bank</h1>
        <Link href="/signup">
            <button>Create User</button>
        </Link>
        </div>
    );
}
