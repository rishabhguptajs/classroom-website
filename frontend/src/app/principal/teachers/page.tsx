"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

export default function Teachers() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
  const [newTeacherEmail, setNewTeacherEmail] = useState<string>("")
  const [newTeacherPassword, setNewTeacherPassword] = useState<string>("")
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [updatedTeacherEmail, setUpdatedTeacherEmail] = useState<string>("")
  const [updatedTeacherPassword, setUpdatedTeacherPassword] =
    useState<string>("")
  const router = useRouter()

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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/delete-teacher/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      setTeachers(teachers.filter((teacher: any) => teacher._id !== id))
      toast.success("Teacher deleted successfully.")
    } catch (err: any) {
      console.error("Error deleting teacher:", err)
    }
  }

  const handleUpdate = (teacher: any) => {
    setSelectedTeacher(teacher)
    setUpdatedTeacherEmail(teacher.email)
    setUpdatedTeacherPassword("")
    setIsUpdateModalOpen(true)
  }

  const handleAddTeacher = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/create-teacher`,
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
  
      console.log('Add Teacher Response:', res.data);
  
      setTeachers((prevTeachers) => [
        ...prevTeachers,
        { _id: res.data._id, email: newTeacherEmail },
      ])
      setNewTeacherEmail("")
      setNewTeacherPassword("")
      toast.success("Teacher added successfully.")
      setTimeout(() => {
        setIsModalOpen(false)
      }, 700);
    } catch (err: any) {
      console.error("Error adding teacher:", err)
      toast.error("Failed to add teacher.")
    }
  }

  const handleSubmitUpdate = async () => {
    if (!selectedTeacher) {
      console.error("No teacher selected for update.");
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/update-teacher`,
        {
          teacherId: selectedTeacher._id,
          email: updatedTeacherEmail,
          password: updatedTeacherPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    
      const resTeachers = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      setTeachers(resTeachers.data);
      toast.success("Teacher updated successfully.");
      setTimeout(() => {
        setIsUpdateModalOpen(false);
      }, 700);
    } catch (err: any) {
      console.error("Error updating teacher:", err.response?.data || err.message);
    }
  }

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <Toaster />
      <div className="container mx-auto p-6 max-w-6xl flex-grow">
        <h2 className="text-4xl font-bold mb-8 text-center">Teachers</h2>

        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push("/principal/dashboard")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-transform transform hover:scale-105"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-transform transform hover:scale-105"
          >
            Add New Teacher
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
              {teachers.map((teacher: any) => (
                <tr key={teacher._id} className="border-b">
                  <td className="py-2 px-4">{teacher.email}</td>
                  <td className="py-2 px-4 text-center flex justify-center gap-4">
                    <button
                      onClick={() => handleUpdate(teacher)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded shadow"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(teacher._id)}
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
              Add New Teacher
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={newTeacherEmail}
                onChange={(e) => setNewTeacherEmail(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="Enter email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={newTeacherPassword}
                onChange={(e) => setNewTeacherPassword(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="Enter password"
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
                onClick={handleAddTeacher}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && selectedTeacher && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-gray-800">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Update Teacher
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={updatedTeacherEmail}
                onChange={(e) => setUpdatedTeacherEmail(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="Enter new email"
                disabled
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={updatedTeacherPassword}
                onChange={(e) => setUpdatedTeacherPassword(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="Enter new password"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
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
    </div>
  )
}
