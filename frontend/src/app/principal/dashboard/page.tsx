"use client";

import Link from 'next/link';

export default function PrincipalDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Principal Dashboard</h1>

      <div className="mb-4">
        <Link href="/principal/teachers">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Teachers
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <Link href="/principal/students">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Students
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <Link href="/principal/create-classroom">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Create Classroom
          </button>
        </Link>
      </div>

      <div>
        <Link href="/principal/assign-classroom">
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Assign Classroom
          </button>
        </Link>
      </div>
    </div>
  );
}
