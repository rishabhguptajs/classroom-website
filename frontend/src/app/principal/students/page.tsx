"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

export default function Students() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [newStudentEmail, setNewStudentEmail] = useState<string>("")
  const [newStudentPassword, setNewStudentPassword] = useState<string>("")
  const [currentStudent, setCurrentStudent] = useState<any>(null)
  const [updatedEmail, setUpdatedEmail] = useState<string>("")
  const [updatedPassword, setUpdatedPassword] = useState<string>("")
  const router = useRouter()

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
      setStudents(students.filter((student: any) => student._id !== id))
      toast.success("Student deleted successfully.")
    } catch (err: any) {
      console.error("Error deleting student:", err)
      toast.error("Failed to delete student.")
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
      setStudents([
        ...students,
        { email: newStudentEmail, _id: new Date().toISOString() },
      ])
      setNewStudentEmail("")
      setNewStudentPassword("")
      toast.success("Student added successfully.")
      setTimeout(() => {
        setIsModalOpen(false)
      }, 1000);
    } catch (err: any) {
      console.error("Error adding student:", err)
      toast.error("Failed to add student.")
    }
  }

  const handleUpdateStudent = async () => {
    if (currentStudent) {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/update-student`,
          {
            email: updatedEmail,
            password: updatedPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        setStudents(
          students.map((student: any) =>
            student._id === currentStudent._id
              ? { ...student, email: updatedEmail }
              : student
          )
        )
        setUpdatedEmail("")
        setUpdatedPassword("")
        toast.success("Student updated successfully.")
        setTimeout(() => {
          setIsEditModalOpen(false)
        }, 1000)
        setCurrentStudent(null)
      } catch (err: any) {
        console.error("Error updating student:", err)
        toast.error("Failed to update student.")
      }
    }
  }

  const openEditModal = (student: any) => {
    setCurrentStudent(student)
    setUpdatedEmail(student.email)
    setUpdatedPassword("")
    setIsEditModalOpen(true)
  }

  if (loading)
    return <div className="text-center p-4 text-white">Loading...</div>
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-purple-500">
      <Toaster />
      <div className="flex-grow container mx-auto p-6 max-w-6xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white bg-opacity-75 p-4 rounded-lg">
          Students
        </h2>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push("/principal/dashboard")}
            className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Add Student
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-2 px-4 text-left text-gray-600">Email</th>
                <th className="py-2 px-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center py-4">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="border-b">
                    <td className="py-2 px-4">{student.email}</td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => openEditModal(student)}
                        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded-lg shadow-md transition-transform transform hover:scale-105 ml-2"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Student Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  placeholder="Enter email"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  placeholder="Enter password"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-1 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="bg-green-600 hover:bg-green-800 text-white font-bold py-1 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {isEditModalOpen && currentStudent && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Student</h3>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  placeholder="Enter email"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={updatedPassword}
                  onChange={(e) => setUpdatedPassword(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  placeholder="Enter new password"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-1 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStudent}
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
