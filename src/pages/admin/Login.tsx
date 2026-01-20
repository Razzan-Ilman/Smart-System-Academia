import React, { useState } from "react";
import icon2 from "../../images/icon2.png";
import { Link, useNavigate } from "react-router-dom";
import api from "../../service/api";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // HANDLE LOGIN SESUAI API SSA
  // ==========================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/user/login", {
        email,
        password,
      });

      // 🔥 AMBIL TOKEN DENGAN BERBAGAI KEMUNGKINAN
      const accessToken =
        res.data?.access_token ||
        res.data?.data?.access_token ||
        res.data?.token ||
        res.data?.data?.token;

      const refreshToken =
        res.data?.refresh_token ||
        res.data?.data?.refresh_token;

      if (!accessToken) {
        console.log("Response API:", res.data);
        throw new Error("Token tidak ditemukan dari API");
      }

      // SIMPAN TOKEN
      localStorage.setItem("token", accessToken);

      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      navigate("/admin/dashboard");

    } catch (err: any) {
      console.log("Error login:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient-slow"></div>

      {/* LEFT */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl w-[90%] max-w-lg p-8 md:px-20 md:py-16"
        >
          {/* ERROR */}
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl"
              placeholder="Masukkan email Anda"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl"
              placeholder="Masukkan password Anda"
            />
          </div>

          <p className="text-sm text-gray-500 mb-4 text-center">
            Belum memiliki akun?{" "}
            <Link
              to="/admin/register"
              className="text-purple-600 font-medium"
            >
              Daftar disini
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg"
          >
            {loading ? "Loading..." : "Log in"}
          </button>
        </form>
      </div>

      {/* RIGHT */}
      <div className="hidden md:flex md:w-1/2 h-screen overflow-hidden relative">
        <img
          src={icon2}
          alt="Smart Dashboard"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default AdminLogin;
