"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Session {
  day: string;
  startTime: string;
  endTime: string;
}

interface Classroom {
  _id: string;
  name: string;
  students: string[];
  teacher: string;
  sessions: Session[];
}

export default function PrincipalDashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [updatedSessions, setUpdatedSessions] = useState<Session[]>([]); 

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

  const openModal = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setUpdatedSessions(classroom.sessions);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClassroom(null);
    setUpdatedSessions([]);
  };

  const handleUpdateSessions = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classrooms/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            classroomId: selectedClassroom?._id,
            sessions: updatedSessions,
          }),
        }
      );
      closeModal();
      fetchClassrooms(); 
    } catch (err: any) {
      console.error("Error updating classroom sessions:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="flex-grow container mx-auto p-6 max-w-6xl">
        <Link href={"/"} className="my-2">
          <span className="text-black rounded-lg bg-white p-2 text-sm font-semibold">
            Back to Home
          </span>
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
                <span className="font-semibold">Teacher:</span>{" "}
                {classroom.teacher}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Students:</span>{" "}
                {classroom.students.length}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Sessions:</span>{" "}
                {classroom.sessions.length}
              </p>
              <button
                onClick={() => openModal(classroom)}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow"
              >
                Edit Timetable
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedClassroom && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit Timetable for {selectedClassroom.name}
      </h2>
      <div className="space-y-6">
        {updatedSessions.map((session, index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 rounded-lg shadow-sm"
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Day</label>
              <input
                type="text"
                value={session.day}
                onChange={(e) =>
                  setUpdatedSessions((prev) => {
                    const newSessions = [...prev];
                    newSessions[index].day = e.target.value;
                    return newSessions;
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold">
                  Start Time
                </label>
                <input
                  type="text"
                  value={session.startTime}
                  onChange={(e) =>
                    setUpdatedSessions((prev) => {
                      const newSessions = [...prev];
                      newSessions[index].startTime = e.target.value;
                      return newSessions;
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  End Time
                </label>
                <input
                  type="text"
                  value={session.endTime}
                  onChange={(e) =>
                    setUpdatedSessions((prev) => {
                      const newSessions = [...prev];
                      newSessions[index].endTime = e.target.value;
                      return newSessions;
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={closeModal}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdateSessions}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
        > 
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
