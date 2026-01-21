import React, { useState } from "react";
import icon2 from "../../images/icon2.png";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/adminService";
import { toast } from "sonner";

const AdminRegister: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name || !username || !password || !confirmPassword) {
      setError("Semua kolom wajib diisi");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.register({
        email: email,
        username: username,
        password: password,
        confirmPassword: confirmPassword,
        role: "admin"
      });
      toast.success("Register berhasil! Silakan login.");
      navigate("/admin/login");
    } catch (err: any) {
      let errorMessage = err.response?.data?.message || err.message || "Register gagal";

      // Handle Duplicate Name/Username Error
      if (errorMessage.includes("duplicate key value violates unique constraint")) {
        if (errorMessage.includes("uni_users_name")) {
          errorMessage = "Nama atau Username sudah digunakan. Silakan gunakan yang lain.";
        } else if (errorMessage.includes("email")) {
          errorMessage = "Email sudah terdaftar. Silakan gunakan email lain.";
        } else {
          errorMessage = "Data sudah terdaftar. Silakan periksa kembali input Anda.";
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />

      {/* LEFT - FORM */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Register Admin
        </h1>

        <form
          onSubmit={handleRegister}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl w-[90%] max-w-lg p-8 md:px-20 md:py-16"
        >
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              placeholder="Masukan Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* NAME */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              required
              value={name}
              placeholder="Masukan Nama Lengkap"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* USERNAME */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              placeholder="Masukan Username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              placeholder="Masukan Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Masukan Konfirmasi Password"
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          <p className="text-sm text-gray-500 mb-4 text-center">
            Sudah punya akun?{" "}
            <Link
              to="/admin/login"
              className="text-purple-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Mendaftarkan..." : "Register"}
          </button>
        </form>
      </div>

      {/* RIGHT - IMAGE */}
      <div className="hidden md:flex md:w-1/2 h-screen overflow-hidden relative z-10">
        <img
          src={icon2}
          alt="Admin Register"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
};

export default AdminRegister;
