import { BrowserRouter, Routes, Route } from "react-router-dom";

// ADMIN PAGES
import AdminLogin from "./pages/admin/Login";
import AdminRegister from "./pages/admin/Register";

// USER PAGES
import Home from "./pages/user/Home";
import DetailProduk from "./pages/user/detailProduk";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* USER */}
        <Route path="/" element={<Home />} />
        <Route path="/produk/detail" element={<DetailProduk />} />

        {/* ADMIN LOGIN VIA URL */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
