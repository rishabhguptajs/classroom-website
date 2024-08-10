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
    <div className="container mx-auto p-4">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 text-center">Create Classroom</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/principal/dashboard")}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Classroom Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter classroom name"
            required
          />
        </div>

        {sessions.map((session, index) => (
          <div key={index} className="mb-4 border p-4 rounded-md">
            <label className="block text-gray-700">Day</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              value={session.day}
              onChange={(e) => handleSessionChange(index, "day", e.target.value)}
              placeholder="e.g., Monday"
              required
            />
            <label className="block text-gray-700 mt-2">Start Time</label>
            <input
              type="time"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              value={session.startTime}
              onChange={(e) => handleSessionChange(index, "startTime", e.target.value)}
              required
            />
            <label className="block text-gray-700 mt-2">End Time</label>
            <input
              type="time"
              className="w-full px-4 py-2 mt-2 border rounded-md"
              value={session.endTime}
              onChange={(e) => handleSessionChange(index, "endTime", e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveSession(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2"
            >
              Remove
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={handleAddSession}
          className="bg-blue-500 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Add Session
        </button>
        
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Create Classroom
        </button>
      </form>
    </div>
  );
}
