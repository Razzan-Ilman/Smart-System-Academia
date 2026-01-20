import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import AdminLayout from "./components/AdminLayout";

// ADMIN PAGES
import AdminLogin from "./pages/admin/Login";
// import AdminRegister from "./pages/admin/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminKategoriProduk from "./pages/admin/KategoriProduk";
import AdminTambahKategori from "./pages/admin/TambahKategori";
import AdminEditKategori from "./pages/admin/EditKategori";
import AdminProduk from "./pages/admin/Produk";
import AdminTambahProduk from "./pages/admin/TambahProduk";
import AdminEditProduk from "./pages/admin/EditProduk";
import AdminListTransaksi from "./pages/admin/ListTransaksi";

// USER PAGES
import Home from "./pages/user/Home";
import DetailProduk from "./pages/user/detailProduk";
import Payment from "./pages/user/Payment";
import Qris from "./pages/user/qris";
import VirtualAccount from './pages/user/VirtualAkun';
import PaymentSuccess from './pages/user/PaymentSuccess';
import PaymentFailed from './pages/user/PaymentFailed';
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* USER */}
          <Route path="/" element={<Home />} />
          <Route path="/produk/detail" element={<DetailProduk />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/qris" element={<Qris />} />
          <Route path="/virtual-account" element={<VirtualAccount />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />


          {/* ADMIN */}
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* <Route path="/admin/register" element={<AdminRegister />} /> */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="kategori-produk" element={<AdminKategoriProduk />} />
            <Route path="kategori-produk/tambah" element={<AdminTambahKategori />} />
            <Route path="kategori-produk/edit/:id" element={<AdminEditKategori />} />
            <Route path="produk" element={<AdminProduk />} />
            <Route path="produk/tambah" element={<AdminTambahProduk />} />
            <Route path="produk/edit/:id" element={<AdminEditProduk />} />
            <Route path="list-transaksi" element={<AdminListTransaksi />} />
          </Route>

          {/* 404 Not Found - Catch all routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
