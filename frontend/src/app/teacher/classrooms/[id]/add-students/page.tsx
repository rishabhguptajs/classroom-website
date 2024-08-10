"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"

const AddStudent = () => {
  const router = useRouter()
  const { id } = useParams() // Access the classroom ID from the URL
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/students/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        // Directly set the students array if the response is an array of students
        setStudents(res.data)
      } catch (err: any) {
        console.error("Error fetching students:", err)
        setError("Failed to fetch students.")
      }
    }

    fetchStudents()
  }, [])

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStudentId) {
      setError("Please select a student.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classrooms/assign-student`,
        { classroomId: id, studentId: selectedStudentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      router.push(`/teacher/dashboard`)
    } catch (err: any) {
      console.error("Error adding student:", err)
      setError("Failed to add student.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <div className="container mx-auto p-6 max-w-2xl flex-grow">
        <h2 className="text-4xl font-bold mb-8 text-center">
          Add Student to Classroom
        </h2>

        <form onSubmit={handleAddStudent} className="bg-white text-gray-700 p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="student" className="block text-sm font-medium text-gray-900">
              Select Student
            </label>
            <select
              id="student"
              value={selectedStudentId || ""}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-300 focus:border-blue-300"
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                    {student.email}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow"
            >
              {loading ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStudent
