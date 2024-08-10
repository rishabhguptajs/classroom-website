"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface Session {
  day: string;
  startTime: string;
  endTime: string;
}

export default function CreateClassroom() {
  const [name, setName] = useState("");
  const [sessions, setSessions] = useState<Session[]>([{ day: "", startTime: "", endTime: "" }]);
  const router = useRouter();

  const handleAddSession = () => {
    setSessions([...sessions, { day: "", startTime: "", endTime: "" }]);
  };

  const handleSessionChange = (index: number, field: string, value: string) => {
    const updatedSessions = sessions.map((session, i) =>
      i === index ? { ...session, [field]: value } : session
    );
    setSessions(updatedSessions);
  };

  const handleRemoveSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classrooms/create`,
        {
          name,
          sessions,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Classroom created successfully");
      setTimeout(() => {
        router.push("/principal/dashboard");
      }, 800);
    } catch (error: any) {
      toast.error("Failed to create classroom: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 to-blue-500 flex flex-col">
      <div className="flex-grow container mx-auto p-6 max-w-4xl">
        <Toaster />
        <h2 className="text-3xl font-bold mb-6 text-center text-white bg-opacity-75 p-4 rounded-lg">
          Create Classroom
        </h2>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push("/principal/dashboard")}
            className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Back to Dashboard
          </button>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700">Classroom Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter classroom name"
              required
            />
          </div>

          {sessions.map((session, index) => (
            <div key={index} className="mb-6 border p-4 rounded-md bg-gray-50 shadow-sm">
              <label className="block text-gray-700">Day</label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={session.day}
                onChange={(e) => handleSessionChange(index, "day", e.target.value)}
                placeholder="e.g., Monday"
                required
              />
              <label className="block text-gray-700 mt-2">Start Time</label>
              <input
                type="time"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={session.startTime}
                onChange={(e) => handleSessionChange(index, "startTime", e.target.value)}
                required
              />
              <label className="block text-gray-700 mt-2">End Time</label>
              <input
                type="time"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={session.endTime}
                onChange={(e) => handleSessionChange(index, "endTime", e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveSession(index)}
                className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-2 rounded-lg mt-4 transition-transform transform hover:scale-105"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={handleAddSession}
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Add Session
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Create Classroom
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
