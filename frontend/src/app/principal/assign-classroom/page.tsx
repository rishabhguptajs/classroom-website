"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

interface Classroom {
  _id: string
  name: string
}

interface Teacher {
  _id: string
  name: string
  email: string
}

export default function AssignClassroomToTeacher() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedClassroom, setSelectedClassroom] = useState<string>("")
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classroomRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classrooms/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )

        const teacherRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )

        setClassrooms(classroomRes.data)
        setTeachers(teacherRes.data)
      } catch (error: any) {
        toast.error("Failed to load data: " + error.message)
      }
    }

    fetchData()
  }, [])

  const handleAssign = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classrooms/assign-teacher`,
        {
          classroomId: selectedClassroom,
          teacherId: selectedTeacher,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      toast.success("Teacher assigned to classroom successfully")
      setSelectedClassroom("")
      setSelectedTeacher("")
      router.push("/principal/dashboard")
    } catch (error: any) {
      toast.error("Failed to assign teacher: " + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 to-blue-500 flex flex-col">
      <div className="flex-grow container mx-auto p-6 max-w-4xl">
        <Toaster />
        <h2 className="text-3xl font-bold mb-6 text-center text-white bg-opacity-75 p-4 rounded-lg">
          Assign Teacher to Classroom
        </h2>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push("/principal/dashboard")}
            className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <label className="block text-gray-700">Select Classroom</label>
            <select
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
            >
              <option value="">Select a Classroom</option>
              {classrooms.map((classroom) => (
                <option key={classroom._id} value={classroom._id}>
                  {classroom.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Select Teacher</label>
            <select
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="">Select a Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.email}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAssign}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Assign Teacher
          </button>
        </div>
      </div>
    </div>
  )
}
