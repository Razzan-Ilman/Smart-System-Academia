# API Integration - Production Setup

## ✅ API Base URL
```
https://ssa-payment.lskk.co.id/api/v1
```

## 📋 Endpoint Structure

Berdasarkan base URL, endpoint yang digunakan:

### Products
- `GET    /products` - List all products
- `GET    /products/:id` - Get single product
- `POST   /products` - Create new product
- `PUT    /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Categories
- `GET    /categories` - List all categories
- `GET    /categories/:id` - Get single category
- `POST   /categories` - Create new category
- `PUT    /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Add-ons
- `GET    /products/:productId/add-ons` - List add-ons for product
- `POST   /products/:productId/add-ons` - Create add-on
- `PUT    /products/:productId/add-ons/:addOnId` - Update add-on
- `DELETE /products/:productId/add-ons/:addOnId` - Delete add-on

---

## 🔧 Setup yang Sudah Dilakukan

### 1. File `.env` sudah diupdate:
```env
VITE_API_BASE_URL=https://ssa-payment.lskk.co.id/api/v1
VITE_USE_API=true
```

### 2. Dev server sudah restart

### 3. Axios instance sudah dikonfigurasi:
- Base URL: dari environment variable
- Timeout: 10 detik
- Auto Bearer token
- Error handling untuk 401, 403, 404, 500

---

## 🧪 Testing

### Langkah Testing:

1. **Buka Browser Developer Tools (F12)**

2. **Buka tab Network**

3. **Coba tambah produk baru:**
   - Isi form lengkap
   - Klik "Simpan"
   - Lihat request di Network tab

4. **Yang perlu dicek:**
   - Request URL: `https://ssa-payment.lskk.co.id/api/v1/products`
   - Method: `POST`
   - Status: 200 atau 201 (sukses)
   - Response: data produk yang baru dibuat

---

## 🐛 Troubleshooting

### Jika masih error, cek:

#### 1. **CORS Error**
Jika muncul CORS error, backend perlu enable CORS untuk domain:
- `http://localhost:5173` (development)
- Domain production Anda

#### 2. **401 Unauthorized**
- Pastikan sudah login
- Token tersimpan di localStorage
- Token belum expired

#### 3. **Network Error**
- Pastikan internet connected
- API server running
- URL benar

#### 4. **Payload Error**
Cek di Console, payload yang dikirim harus sesuai format:
```json
{
  "name": "string",
  "description": "string",
  "price": number,
  "link_product": "string",
  "images": ["string"],
  "category_id": number,
  "stock": number,
  "add_ons": [
    {
      "name": "string",
      "price": number,
      "link_add_ons": "string"
    }
  ]
}
```

---

## 📝 Next Steps

1. **Test tambah produk** - Lihat apakah berhasil
2. **Cek Console & Network** - Screenshot jika ada error
3. **Verifikasi endpoint** - Pastikan endpoint sesuai dengan backend
4. **Test CRUD lengkap** - Create, Read, Update, Delete

---

## 🔐 Authentication

Jika API memerlukan authentication:

### Login Flow:
1. User login via `/auth/login`
2. Backend return token
3. Token disimpan di localStorage
4. Setiap request auto include: `Authorization: Bearer <token>`

### Logout Flow:
1. Call `authService.logout()`
2. Token dihapus dari localStorage
3. Redirect ke login page

---

## 📞 Support

Jika masih ada masalah:
1. Screenshot Console error
2. Screenshot Network tab (request & response)
3. Berikan detail error message

Saya akan bantu troubleshoot lebih lanjut!
