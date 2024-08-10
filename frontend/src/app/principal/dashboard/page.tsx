"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Classroom {
  _id: string;
  name: string;
  students: string[];
  teacher: string;
  sessions: string[];
}

export default function PrincipalDashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const fetchClassrooms = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classrooms/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setClassrooms(data);
    } catch (err: any) {
      console.error("Error fetching classrooms:", err);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="flex-grow container mx-auto p-6 max-w-6xl">
      <Link href={'/'} className="my-2">
          <span className="text-black rounded-lg bg-white p-2 text-sm font-semibold">Back to Home</span>
        </Link>
        <h1 className="text-4xl font-bold mb-8 p-4 rounded-lg text-center bg-white">
        
          Principal Dashboard
        </h1>

        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Link href="/principal/teachers">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-transform transform hover:scale-105">
              View Teachers
            </button>
          </Link>
          <Link href="/principal/students">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-transform transform hover:scale-105">
              View Students
            </button>
          </Link>
          <Link href="/principal/create-classroom">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-transform transform hover:scale-105">
              Create Classroom
            </button>
          </Link>
          <Link href="/principal/assign-classroom">
            <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-transform transform hover:scale-105">
              Assign Classroom
            </button>
          </Link>
        </div>

        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          Classrooms
        </h2>

        <div className="space-y-6">
          {classrooms.map((classroom) => (
            <div
              key={classroom._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {classroom.name}
              </h3>
              <p className="text-gray-700">
                <span className="font-semibold">Teacher:</span> {classroom.teacher}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Students:</span>{" "}
                {classroom.students.length}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Sessions:</span>{" "}
                {classroom.sessions.length}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
