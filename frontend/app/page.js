import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to the Bank</h1>
      <p className="mt-2 text-gray-600">Manage your finances securely.</p>

      <nav className="mt-4">
        <Link href="/login" className="text-blue-600 hover:underline">Login</Link> | 
        <Link href="/signup" className="text-blue-600 hover:underline ml-2">Create User</Link>
      </nav>
    </div>
  );
}