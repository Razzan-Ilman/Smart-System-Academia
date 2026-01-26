import React, { useState } from "react";
import PhoneAnimation from "../../components/PhoneAnimation";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/adminService";
import { toast } from "sonner";
import logo from "../../assets/images/logo.png";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authService.login(email, password);

      // authService already handles token storage to 'admin_token'
      // but if we also want 'token' for other parts of the app:
      const token = data?.access_token || data?.data?.access_token || data?.token || data?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      // Store user data for display purposes
      const userData = {
        name: data?.user?.name || data?.data?.user?.name || data?.name || "Admin",
        email: data?.user?.email || data?.data?.user?.email || data?.email || email,
        role: data?.user?.role || data?.data?.user?.role || data?.role || "admin"
      };
      localStorage.setItem("user_data", JSON.stringify(userData));

      toast.success("Login berhasil!");
      navigate("/admin/dashboard");

    } catch (err: any) {
      console.log("Error login:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Login gagal";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Multi-layer Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-pink-100/40"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/20 via-transparent to-blue-200/20 animate-gradient-slow" style={{ backgroundSize: '200% 200%' }}></div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-300/30 to-blue-300/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/25 to-pink-300/25 rounded-full blur-3xl animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-3xl animate-spin-very-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-gradient-to-br from-indigo-300/15 to-cyan-300/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                       radial-gradient(circle at 40% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`
        }}
      ></div>

      {/* LEFT - FORM */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative z-10 px-4 py-8">
        {/* Subtle accent gradient for form side */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-blue-50/30 pointer-events-none"></div>

        {/* Logo */}
        <div className="mb-6 relative z-10 animate-fade-in">
          <img src={logo} alt="SSA Logo" className="h-20 w-auto object-contain" />
        </div>

        {/* Title with enhanced typography */}
        <h1 className="text-5xl font-bold mb-10 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent relative z-10 tracking-tight animate-fade-in px-2 py-1 leading-tight" style={{ animationDelay: '0.1s' }}>
          Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="bg-white/85 backdrop-blur-xl rounded-[2rem] w-full max-w-[480px] px-12 py-12 border border-purple-200/40 relative z-10 animate-slide-up"
          style={{
            boxShadow: '0 20px 60px -15px rgba(139, 92, 246, 0.15), 0 10px 30px -10px rgba(59, 130, 246, 0.1)',
            animationDelay: '0.2s'
          }}
        >
          {/* ERROR */}
          {error && (
            <div className="mb-6 text-red-600 text-sm text-center bg-red-50 py-3 px-4 rounded-xl border border-red-200 animate-shake">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-7">
            <label className="block text-sm font-semibold mb-2.5 text-gray-700 uppercase tracking-wide">
              Email
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 text-base border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 focus:bg-white outline-none transition-all duration-200"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2.5 text-gray-700 uppercase tracking-wide">
              Password
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-4 text-base border border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 focus:bg-white outline-none transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-7 text-center">
            Belum memiliki akun?{" "}
            <Link
              to="/admin/register"
              className="text-purple-600 font-semibold hover:text-purple-700 relative inline-block group"
            >
              Daftar disini
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4.5 rounded-xl font-semibold text-base hover:from-purple-700 hover:to-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memproses...</span>
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>
      </div>

      {/* VERTICAL DIVIDER */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-300/50 to-transparent z-20"></div>

      {/* RIGHT - PHONE ANIMATION */}
      <div className="hidden md:flex md:w-1/2 h-screen overflow-hidden relative">
        {/* Enhanced animated background for animation side */}
        <div className="absolute inset-0 bg-gradient-to-bl from-purple-200/60 via-blue-200/50 to-pink-200/60"></div>

        {/* Additional animated elements for more dynamic background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-bounce-subtle"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-indigo-400/20 rounded-full blur-xl animate-pulse-slower"></div>
        </div>

        {/* Decorative dots pattern */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        ></div>

        {/* Gradient overlay untuk sinkronisasi dengan sisi kiri */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-100/10 to-purple-50/20"></div>

        <PhoneAnimation />
      </div>
    </div>
  );
};

export default AdminLogin;
