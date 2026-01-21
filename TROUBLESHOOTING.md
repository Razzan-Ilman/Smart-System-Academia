# Troubleshooting Guide - API Integration

## Masalah: Gagal Menambah Produk

### Langkah Debugging:

#### 1. **Periksa Console Browser**
Buka Developer Tools (F12) → Console tab
Cari error message yang muncul saat klik tombol "Simpan"

**Error yang mungkin muncul:**
- `Network Error` → Backend tidak running atau URL salah
- `404 Not Found` → Endpoint API tidak ditemukan
- `500 Internal Server Error` → Error di backend
- `CORS Error` → Backend belum setup CORS
- `401 Unauthorized` → Token tidak valid/expired

---

#### 2. **Periksa Network Tab**
Developer Tools → Network tab → Klik "Simpan"

**Yang perlu dicek:**
- Request URL: Apakah URL benar?
- Request Method: Harus `POST`
- Request Payload: Apakah data terkirim dengan benar?
- Response Status: 200/201 = sukses, 4xx/5xx = error
- Response Data: Pesan error dari backend

---

#### 3. **Periksa Backend API**

**Pastikan:**
- ✅ Backend server sudah running
- ✅ Port sesuai (default: 3000)
- ✅ Endpoint `/api/products` tersedia
- ✅ CORS sudah di-enable
- ✅ Database connection OK

**Test dengan Postman/Thunder Client:**
```http
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Test Product",
  "description": "Test Description",
  "price": 100000,
  "link_product": "https://example.com",
  "images": [],
  "category_id": 1,
  "stock": 10,
  "add_ons": []
}
```

---

#### 4. **Periksa Environment Variables**

File: `.env`

```env
# Pastikan URL sesuai dengan backend Anda
VITE_API_BASE_URL=http://localhost:3000/api

# Set ke 'false' untuk menggunakan localStorage (development tanpa backend)
VITE_USE_API=false
```

**Setelah edit .env, RESTART dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## Solusi Berdasarkan Error:

### A. **Network Error / Cannot Connect**

**Penyebab:**
- Backend tidak running
- URL salah
- Port berbeda

**Solusi:**
1. Pastikan backend running
2. Update `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:PORT_BACKEND/api
   ```
3. Restart dev server

**Atau gunakan localStorage fallback:**
```env
VITE_USE_API=false
```

---

### B. **CORS Error**

**Penyebab:**
Backend belum enable CORS untuk frontend

**Solusi di Backend (Node.js/Express):**
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
```

---

### C. **404 Not Found**

**Penyebab:**
- Endpoint tidak ada
- Base URL salah
- Route tidak match

**Solusi:**
1. Cek endpoint di backend
2. Pastikan route: `POST /api/products`
3. Update base URL di `.env`

---

### D. **401 Unauthorized**

**Penyebab:**
Token tidak valid atau expired

**Solusi:**
1. Login ulang
2. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Login lagi

---

### E. **500 Internal Server Error**

**Penyebab:**
Error di backend (database, validation, dll)

**Solusi:**
1. Cek log backend
2. Cek database connection
3. Cek validation rules
4. Cek payload format

---

## Mode Development Tanpa Backend

Jika backend belum siap, gunakan localStorage mode:

### 1. Edit `.env`:
```env
VITE_USE_API=false
```

### 2. Restart dev server:
```bash
npm run dev
```

### 3. Sekarang semua operasi akan menggunakan localStorage

**Fitur yang tersedia:**
- ✅ Create, Read, Update, Delete Product
- ✅ Create, Read, Update, Delete Category
- ✅ Semua data tersimpan di browser localStorage
- ✅ Data persist sampai localStorage di-clear

---

## Menggunakan Service dengan Fallback

Jika ingin otomatis fallback ke localStorage saat API error:

### Update import di file component:

**Sebelum:**
```typescript
import { productService } from '../../services/adminService';
```

**Sesudah:**
```typescript
import { productServiceWithFallback as productService } from '../../services/serviceWithFallback';
```

**Keuntungan:**
- Auto fallback ke localStorage jika API error
- Tidak perlu restart server
- Development lebih smooth

---

## Checklist Debugging:

- [ ] Backend server running?
- [ ] URL di `.env` benar?
- [ ] Port sesuai?
- [ ] CORS enabled di backend?
- [ ] Endpoint `/api/products` tersedia?
- [ ] Database connection OK?
- [ ] Token valid (jika ada auth)?
- [ ] Payload format sesuai?
- [ ] Dev server sudah restart setelah edit `.env`?

---

## Kontak & Bantuan

Jika masih error, screenshot:
1. Console error
2. Network tab (request & response)
3. File `.env`
4. Backend log (jika ada)

Lalu share untuk debugging lebih lanjut.
