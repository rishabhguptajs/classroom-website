"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('/api/students').then((res) => setStudents(res.data));
  }, []);

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/students/${id}`);
    setStudents(students.filter((student: any) => student._id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student: any) => (
            <tr key={student._id}>
              <td className="py-2">{student.name}</td>
              <td className="py-2">{student.email}</td>
              <td className="py-2">
                <button
                  onClick={() => handleDelete(student._id)}
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
  );
}
