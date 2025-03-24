import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between">
            <h1 className="text-lg font-bold">MyBank</h1>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/signup" className="hover:underline">Sign Up</Link>
              <Link href="/account" className="hover:underline">Account</Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-grow container mx-auto p-4">{children}</main>
      </div>
        {children}
      </body>
    </html>
  );
}
