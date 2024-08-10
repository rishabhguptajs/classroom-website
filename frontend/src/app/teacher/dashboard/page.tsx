"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"

const TeacherDashboard = () => {
  const router = useRouter()
  const [classrooms, setClassrooms] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClassrooms = async () => {
      const teacher = JSON.parse(localStorage.getItem("user") || "{}")
      if (!teacher) {
        setError("Teacher not found.")
        setLoading(false)
        return
      }

      console.log(teacher)

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classrooms/getclass/${teacher.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        setClassrooms(res.data)
      } catch (err: any) {
        console.error("Error fetching classrooms:", err)
        setError("Failed to fetch classrooms.")
      } finally {
        setLoading(false)
      }
    }

    fetchClassrooms()
  }, [])

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto p-6 max-w-6xl flex-grow">
        <Link href={"/"} className="my-2">
          <span className="text-black rounded-lg bg-white p-2 text-sm font-semibold">
            Back to Home
          </span>
        </Link>
        <h2 className="text-4xl font-bold mb-8 text-center">
          Teacher Dashboard
        </h2>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => router.push("/teacher/students")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow"
          >
            Manage Students
          </button>
        </div>

        <div className="bg-white text-gray-700 p-4 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            Assigned Classrooms
          </h3>

          {classrooms.length === 0 ? (
            <p className="text-center">No classrooms assigned.</p>
          ) : (
            <ul className="list-disc list-inside">
              {classrooms.map((classroom) => (
                <li key={classroom._id} className="py-2 flex justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <li>
                        <strong>{classroom.name}</strong>
                        <button
                          onClick={() =>
                            router.push(
                              `/teacher/classrooms/${classroom._id}/add-students`
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-lg shadow ml-4"
                        >
                          Add Students
                        </button>
                      </li>
                    </div>
                    {classroom.sessions.map((session: any) => (
                      <p key={session._id} className="pl-4">
                        <span className="font-semibold">{session.day} - </span>
                        <span className="ml-2">
                          {session.startTime} - {session.endTime}
                        </span>
                      </p>
                    ))}
                  </div>

                  <ul className="list-disc list-inside text-right">
                    {classroom.students.length === 0 ? (
                      <li>No students assigned.</li>
                    ) : (
                      classroom.students.map((student: any) => (
                        <li key={student._id}>{student}</li>
                      ))
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
