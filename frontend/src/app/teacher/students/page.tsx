"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"

const Students = () => {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [updatedStudentPassword, setUpdatedStudentPassword] =
    useState<string>("")
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [newStudentEmail, setNewStudentEmail] = useState<string>("")
  const [newStudentPassword, setNewStudentPassword] = useState<string>("")

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/students/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        setStudents(res.data)
      } catch (err: any) {
        console.error("Error fetching students:", err)
        setError("Failed to fetch students.")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/delete-student/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      setStudents(students.filter((student) => student._id !== id))
    } catch (err: any) {
      console.error("Error deleting student:", err)
    }
  }

  const handleUpdate = (student: any) => {
    setSelectedStudent(student)
    setUpdatedStudentPassword("")
    setIsModalOpen(true)
  }

  const handleSubmitUpdate = async () => {
    console.log(selectedStudent)
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/update-student`,
        {
          email: selectedStudent?.email,
          password: updatedStudentPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      setIsModalOpen(false)
    } catch (err: any) {
      console.error("Error updating student:", err)
    }
  }

  const handleAddStudent = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/students/create-student`,
        {
          email: newStudentEmail,
          password: newStudentPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/students/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      setStudents(res.data)

      setIsAddModalOpen(false)
      setNewStudentEmail("")
      setNewStudentPassword("")
    } catch (err: any) {
      console.error("Error adding student:", err)
    }
  }

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto p-6 max-w-6xl flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">Students</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow"
          >
            Add Student
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-gray-700 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-b">
                  <td className="py-2 px-4">{student.email}</td>
                  <td className="py-2 px-4 text-center flex justify-center gap-4">
                    <button
                      onClick={() => handleUpdate(student)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded shadow"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded shadow"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-gray-800">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Update Student Password
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={selectedStudent?.email}
                disabled
                className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-100"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                value={updatedStudentPassword}
                onChange={(e) => setUpdatedStudentPassword(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="Enter new password"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitUpdate}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-gray-800">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Add New Student
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="Enter student email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={newStudentPassword}
                onChange={(e) => setNewStudentPassword(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="Enter student password"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow"
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Students
