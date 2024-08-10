"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

export default function CreateClassroom() {
  const [name, setName] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [days, setDays] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classrooms/create`,
        {
          name,
          startTime,
          endTime,
          days,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      toast.success("Classroom created successfully")
      setTimeout(() => {
        router.push("/principal/dashboard")
      }, 800)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Create Classroom</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Classroom Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Time</label>
          <input
            type="time"
            className="w-full px-4 py-2 mt-2 border rounded-md"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Time</label>
          <input
            type="time"
            className="w-full px-4 py-2 mt-2 border rounded-md"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Days</label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-2 border rounded-md"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Classroom
        </button>
      </form>
    </div>
  )
}
