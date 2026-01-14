import React, { useState } from "react";
import icon2 from "../../images/icon2.png";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Email atau password salah");
      }

      const data = await res.json();
      
      if (data.token) {
        localStorage.setItem("admin_token", data.token);
      }
      
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient-slow"></div>
      
      {/* LEFT */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative z-10">
        <div className="transform transition-all duration-500 hover:scale-105">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 animate-fade-in">
            Login
          </h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl w-[90%] max-w-lg p-8 md:px-20 md:py-16 transform transition-all duration-500 hover:shadow-2xl animate-slide-up"
        >
          {/* ERROR */}
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg animate-shake">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-4 animate-fade-in-delay-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 hover:border-purple-300"
              placeholder="Masukkan email Anda"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6 animate-fade-in-delay-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 hover:border-purple-300"
              placeholder="Masukkan password Anda"
            />
          </div>

          {/* REGISTER LINK */}
          <p className="text-sm text-gray-500 mb-4 text-center animate-fade-in-delay-3">
            Belum memiliki akun?{" "}
            <Link
              to="/admin/register"
              className="text-purple-600 font-medium hover:underline transition-all duration-300 hover:text-purple-700"
            >
              Daftar disini
            </Link>
          </p>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg animate-fade-in-delay-4"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Logging in...
              </span>
            ) : (
              "Log in"
            )}
          </button>
        </form>
      </div>

<div className="hidden md:flex md:w-1/2 h-screen overflow-hidden relative">
  {/* Animated background */}
  <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 animate-gradient"></div>

  {/* IMAGE WRAPPER (CLIP AREA) */}
  <div className="w-full h-full overflow-hidden relative z-10">
    <img
      src={icon2}
      alt="Smart Dashboard"
      className="w-full h-full object-cover object-center animate-float"
    />
  </div>
</div>
      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-slow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-2px);
        }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }

        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 20s ease infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-fade-in-delay-1 {
          animation: fade-in 0.6s ease-out 0.1s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 0.6s ease-out 0.3s both;
        }

        .animate-fade-in-delay-4 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;