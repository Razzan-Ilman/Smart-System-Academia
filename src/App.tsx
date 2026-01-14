import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/user/Home";
import AdminLogin from "./pages/admin/Login";
import AdminRegister from "./pages/admin/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* USER */}
        <Route path="/" element={<Home />} />

        {/* ADMIN LOGIN VIA URL */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
