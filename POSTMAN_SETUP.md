# Panduan Menggunakan Postman sebagai Backend API

## Opsi 1: Postman Mock Server (Recommended)

### Setup di Postman:

1. **Buat Collection di Postman**
   - Buat collection baru: "Smart Academia API"
   - Tambahkan requests untuk semua endpoints

2. **Buat Mock Server**
   - Klik kanan pada collection → "Mock Collection"
   - Beri nama: "Smart Academia Mock"
   - Copy Mock Server URL

3. **Setup Responses**
   Untuk setiap endpoint, tambahkan example response:

#### GET /products
```json
[
  {
    "id": "1",
    "name": "Workshop IOT",
    "description": "Workshop IOT dengan AI",
    "price": 1000000,
    "link_product": "https://example.com",
    "images": ["https://..."],
    "category_id": 1,
    "stock": 30,
    "add_ons": []
  }
]
```

#### POST /products
Request Body:
```json
{
  "name": "Product Name",
  "description": "Description",
  "price": 100000,
  "link_product": "https://...",
  "images": [],
  "category_id": 1,
  "stock": 10,
  "add_ons": []
}
```

Response (201 Created):
```json
{
  "id": "generated-id",
  "name": "Product Name",
  ...
}
```

### Setup di Frontend:

Edit `.env`:
```env
VITE_API_BASE_URL=https://xxxxx.mock.pstmn.io
VITE_USE_API=true
```

Restart dev server:
```bash
npm run dev
```

---

## Opsi 2: json-server (Local Mock API)

### 1. Install json-server:
```bash
npm install -g json-server
```

### 2. File `db.json` sudah dibuat di root project

### 3. Jalankan json-server:
```bash
json-server --watch db.json --port 3000
```

### 4. Setup Frontend:

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_API=true
```

Restart dev server:
```bash
npm run dev
```

### 5. API Endpoints yang tersedia:

```
GET    /products          - List all products
GET    /products/:id      - Get single product
POST   /products          - Create product
PUT    /products/:id      - Update product
PATCH  /products/:id      - Partial update
DELETE /products/:id      - Delete product

GET    /categories        - List all categories
GET    /categories/:id    - Get single category
POST   /categories        - Create category
PUT    /categories/:id    - Update category
DELETE /categories/:id    - Delete category
```

---

## Opsi 3: Import Postman Collection

### 1. Download Collection Template

Saya sudah buatkan template Postman Collection.
Import file `postman-collection.json` ke Postman.

### 2. Setup Environment di Postman

Buat environment baru dengan variables:
- `base_url`: `http://localhost:3000` (atau Mock Server URL)

### 3. Test Endpoints

Test semua endpoints di Postman untuk memastikan berfungsi.

### 4. Gunakan Mock Server atau json-server

Pilih salah satu opsi di atas.

---

## Troubleshooting

### CORS Error dengan json-server:

Jalankan dengan CORS enabled:
```bash
json-server --watch db.json --port 3000 --middlewares ./cors-middleware.js
```

Atau install cors-anywhere:
```bash
npm install -g cors-anywhere
cors-anywhere
```

### Mock Server tidak response:

1. Pastikan example response sudah di-save di Postman
2. Pastikan Mock Server status: Active
3. Test dengan Postman dulu sebelum dari frontend

---

## Rekomendasi untuk Development:

**Gunakan json-server** karena:
- ✅ Gratis unlimited
- ✅ Running di local
- ✅ Full CRUD support
- ✅ Auto-generate ID
- ✅ Relationships support
- ✅ Easy to modify data

**Command untuk start:**
```bash
# Terminal 1: json-server
json-server --watch db.json --port 3000

# Terminal 2: Frontend
npm run dev
```

Sekarang frontend akan connect ke json-server di `http://localhost:3000`!
