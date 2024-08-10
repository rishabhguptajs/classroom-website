"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export default function Teachers() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [newTeacherEmail, setNewTeacherEmail] = useState<string>("")
  const [newTeacherPassword, setNewTeacherPassword] = useState<string>("")

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        setTeachers(res.data)
      } catch (err: any) {
        console.error("Error fetching teachers:", err)
        setError("Failed to fetch teachers.")
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      setTeachers(teachers.filter((teacher: any) => teacher._id !== id))
    } catch (err: any) {
      console.error("Error deleting teacher:", err)
    }
  }

  const handleUpdate = (id: string) => {
    console.log(`Update teacher with ID: ${id}`)
  }

  const handleAddTeacher = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/add`,
        {
          email: newTeacherEmail,
          password: newTeacherPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      setTeachers([
        ...teachers,
        { email: newTeacherEmail, password: newTeacherPassword },
      ])
      setNewTeacherEmail("")
      setNewTeacherPassword("")
      setIsModalOpen(false)
    } catch (err: any) {
      console.error("Error adding teacher:", err)
    }
  }

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Teachers</h2>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Teacher
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left text-gray-600">Email</th>
              <th className="py-2 px-4 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher: any) => (
              <tr key={teacher._id} className="border-b">
                <td className="py-2 px-4">{teacher.email}</td>
                <td className="py-2 px-4 text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleUpdate(teacher._id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Teacher</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="email"
                value={newTeacherEmail}
                onChange={(e) => setNewTeacherEmail(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="Enter name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="password"
                value={newTeacherPassword}
                onChange={(e) => setNewTeacherPassword(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="Enter email"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeacher}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
