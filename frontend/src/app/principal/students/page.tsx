"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [newStudentEmail, setNewStudentEmail] = useState<string>('');
  const [newStudentPassword, setNewStudentPassword] = useState<string>('');
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [updatedEmail, setUpdatedEmail] = useState<string>('');
  const [updatedPassword, setUpdatedPassword] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/students/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStudents(res.data);
      } catch (err: any) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/delete-student/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStudents(students.filter((student: any) => student._id !== id));
    } catch (err: any) {
      console.error("Error deleting student:", err);
    }
  };

  const handleAddStudent = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/students/create-student`, {
        email: newStudentEmail,
        password: newStudentPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStudents([
        ...students,
        { email: newStudentEmail, _id: new Date().toISOString() },
      ]);
      setNewStudentEmail('');
      setNewStudentPassword('');
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error adding student:", err);
    }
  };

  const handleUpdateStudent = async () => {
    if (currentStudent) {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/teachers/update-student`, {
          email: updatedEmail,
          password: updatedPassword,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStudents(students.map((student: any) =>
          student._id === currentStudent._id
            ? { ...student, email: updatedEmail }
            : student
        ));
        setUpdatedEmail('');
        setUpdatedPassword('');
        setIsEditModalOpen(false);
        setCurrentStudent(null);
      } catch (err: any) {
        console.error("Error updating student:", err);
      }
    }
  };

  const openEditModal = (student: any) => {
    setCurrentStudent(student);
    setUpdatedEmail(student.email);
    setUpdatedPassword('');
    setIsEditModalOpen(true);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Students</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/principal/dashboard")}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Student
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
            {
              students.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center py-4">No students found</td>
                </tr>
              ) : students.map((student) => (
                <tr key={student._id} className="border-b">
                  <td className="py-2 px-4">{student.email}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openEditModal(student)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-2"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

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
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

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
                placeholder="Enter password"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStudent}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
