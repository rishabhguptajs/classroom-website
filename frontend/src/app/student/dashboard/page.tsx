"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Session {
  day: string;
  startTime: string;
  endTime: string;
}

interface TimetableEntry {
  subject: string;
  sessions: Session[];
  teacherEmail: string;
}

export default function StudentDashboard() {
  const [classmates, setClassmates] = useState<Student[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassmates = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/students/classmates`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch classmates.");
      }

      const data = await res.json();
      setClassmates(data);
    } catch (err: any) {
      console.error("Error fetching classmates:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const id = user.id;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classrooms/student-class/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch timetable.");
      }

      const data = await res.json();

      const timetableData = data.map((classroom: any) => ({
        subject: classroom.name,
        sessions: classroom.sessions,
        teacherEmail: classroom.teacher.email,
      }));

      setTimetable(timetableData);
    } catch (err: any) {
      console.error("Error fetching timetable:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassmates();
    fetchTimetable();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto p-6 max-w-6xl flex-grow">
      <Link href={"/"} className="my-2">
          <span className="text-black rounded-lg bg-white p-2 text-sm font-semibold">
            Back to Home
          </span>
        </Link>
        <h2 className="text-4xl font-bold mb-8 text-center">
          Student Dashboard
        </h2>

        <div className="bg-white text-gray-700 p-4 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            My Classmates
          </h3>

          {classmates.length === 0 ? (
            <p className="text-center">No classmates found.</p>
          ) : (
            <ul className="list-disc list-inside">
              {classmates.map((student) => (
                <li key={student._id} className="py-2">
                  <strong>{student.name}</strong> ({student.email})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white text-gray-700 p-4 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            Class Timetable
          </h3>

          {timetable.length === 0 ? (
            <p className="text-center">No timetable available.</p>
          ) : (
            <ul className="list-disc list-inside">
              {timetable.map((entry, index) => (
                <li key={index} className="py-2">
                  <strong>{entry.subject}</strong> (Teacher:{" "}
                  {entry.teacherEmail}):
                  {entry.sessions.map((session, i) => (
                    <div key={i}>
                      {session.day} from {session.startTime} to {session.endTime}
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
