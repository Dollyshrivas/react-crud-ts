import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import type { User } from "./types";
import "./App.css";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Omit<User, "id">>({ name: "", email: "", phone: "" });
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users");
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createUser = (e: FormEvent) => {
    e.preventDefault();
    const newUser: User = { ...form, id: Date.now() };
    setUsers([newUser, ...users]);
    setForm({ name: "", email: "", phone: "" });
  };

  const startEdit = (user: User) => {
    setEditing(user.id);
    setForm({ name: user.name, email: user.email, phone: user.phone });
  };

  const updateUser = (e: FormEvent) => {
    e.preventDefault();
    if (editing === null) return;
    setUsers(users.map(u => (u.id === editing ? { ...u, ...form } : u)));
    setEditing(null);
    setForm({ name: "", email: "", phone: "" });
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-8 drop-shadow-md">
          React CRUD Users (TypeScript)
        </h1>

        {/* Form */}
        <form
          onSubmit={editing ? updateUser : createUser}
          className="grid md:grid-cols-3 gap-4 mb-8 bg-purple-50 p-6 rounded-2xl shadow-inner"
        >
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border border-purple-300 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-purple-300 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border border-purple-300 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
          <button
            className="md:col-span-3 bg-purple-600 text-white font-bold p-3 rounded-xl hover:bg-purple-700 transition shadow-lg"
          >
            {editing ? "Update User" : "Create User"}
          </button>
        </form>

        {/* Users Table */}
        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b hover:bg-purple-50 transition cursor-pointer"
                  >
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.phone}</td>
                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => startEdit(u)}
                        className="bg-yellow-400 text-white px-4 py-1 rounded-xl hover:bg-yellow-500 transition shadow-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded-xl hover:bg-red-600 transition shadow-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
