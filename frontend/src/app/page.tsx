"use client"

import { useAuth } from "@/context/authContext"
import Link from "next/link"

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-gradient-to-r from-blue-500 to-purple-600">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-white drop-shadow-md">
          Welcome to the Classroom Website
        </h1>
        <p className="mt-4 text-xl text-white opacity-75">
          Your gateway to a smarter learning experience
        </p>
      </header>

      <div className="mt-8 flex flex-col items-center space-y-6">
        {user ? (
          <div className="text-center flex flex-col items-center">
            <h2 className="text-2xl mb-4 font-semibold text-white">
              Hello, {user.role}!
            </h2>
            <Link href={`/${user.role.toLowerCase()}/dashboard`}>
              <span className="m-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg transform transition duration-200 hover:scale-105 focus:outline-none">
                Go to Dashboard
              </span>
            </Link>
            <button className="mt-6 px-6 py-3 w-fit bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg transform transition duration-200 hover:scale-105 focus:outline-none"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link
              href="/login"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transform transition duration-200 hover:scale-105 focus:outline-none"
            >
              Login
            </Link>
          </div>
        )}
      </div>

      <footer className="mt-16 text-center">
        <p className="text-white opacity-75">
          © 2024 Classroom Website. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
