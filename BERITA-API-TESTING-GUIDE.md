# API Berita - Panduan Testing Postman

## ⚙️ Setup
- **Base URL**: `http://localhost:3003/api`
- **Service Port**: 3003
- **Semua endpoint sudah dibuat dan siap ditest**

## 📋 Ringkasan Endpoint

### 1. **Berita (News)** - /api/berita
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/berita` | ❌ | Semua berita (pagination: page, limit) |
| GET | `/berita/:id` | ❌ | Detail berita |
| POST | `/berita` | ✅ ADMIN | Buat berita baru |
| PUT | `/berita/:id` | ✅ ADMIN/GURU | Update berita |
| DELETE | `/berita/:id` | ✅ ADMIN | Hapus berita |

**Request Body untuk CREATE:**
```json
{
  "title": "Judul Berita (min 5 char)",
  "content": "Isi berita (min 10 char)",
  "description": "Deskripsi (max 500 char)",
  "excerpt": "Kutipan singkat (max 500 char)",
  "imageUrl": "http://...",
  "categoryId": 1,
  "isFeatured": true
}
```

---

### 2. **Kategori (Categories)** - /api/categories
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/categories` | ❌ | Semua kategori |
| GET | `/categories/:id` | ❌ | Detail kategori |
| POST | `/categories` | ⚠️ | Buat kategori |
| PUT | `/categories/:id` | ⚠️ | Update kategori |
| PUT | `/categories/:id/toggle-active` | ⚠️ | Toggle aktif |
| DELETE | `/categories/:id` | ⚠️ | Hapus kategori |

**Request Body untuk CREATE:**
```json
{
  "name": "Nama Kategori (1-100 char)",
  "description": "Deskripsi (max 500 char)",
  "color": "#FF6B6B",
  "order": 1
}
```

---

### 3. **Pengumuman (Announcements)** - /api/pengumuman
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/pengumuman` | ❌ | Semua pengumuman (pagination) |
| GET | `/pengumuman/:id` | ❌ | Detail pengumuman |
| POST | `/pengumuman` | ⚠️ | Buat pengumuman |
| PUT | `/pengumuman/:id` | ⚠️ | Update pengumuman |
| PUT | `/pengumuman/:id/toggle-active` | ⚠️ | Toggle aktif |
| DELETE | `/pengumuman/:id` | ⚠️ | Hapus pengumuman |

**Request Body untuk CREATE:**
```json
{
  "title": "Judul Pengumuman (5-255 char)",
  "content": "Isi pengumuman (min 10 char)",
  "description": "Deskripsi (max 500 char)",
  "imageUrl": "http://...",
  "type": "penting",
  "author": "Nama Author",
  "expiredAt": "2026-12-31T23:59:59Z"
}
```

**Tipe Pengumuman**: `biasa`, `penting`, `sangat_penting`, `mendesak`

---

### 4. **Agenda (Schedule)** - /api/agenda
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/agenda` | ❌ | Semua agenda (pagination, filterable by category) |
| GET | `/agenda/:id` | ❌ | Detail agenda |
| POST | `/agenda` | ⚠️ | Buat agenda |
| PUT | `/agenda/:id` | ⚠️ | Update agenda |
| PUT | `/agenda/:id/toggle-active` | ⚠️ | Toggle aktif |
| DELETE | `/agenda/:id` | ⚠️ | Hapus agenda |

**Query Parameters untuk GET:**
- `page`: nomor halaman (default: 1)
- `limit`: jumlah data per halaman (default: 100)
- `category`: filter kategori (opsional)

**Request Body untuk CREATE:**
```json
{
  "title": "Judul Agenda",
  "description": "Deskripsi acara",
  "date": "2026-05-15",
  "startTime": "07:00",
  "endTime": "12:00",
  "location": "Ruang Kelas",
  "participants": "Peserta kegiatan",
  "category": "ujian",
  "imageUrl": "http://..."
}
```

**Kategori Agenda**: `akademik`, `ekstrakurikuler`, `outing`, `libur`, `ujian`, `kegiatan`, `lainnya`

---

### 5. **Search** - /api/search
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/search?q=keyword&limit=20` | ❌ | Cari berita + pengumuman |

---

### 6. **Health & Docs** - Utility Endpoints
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/health` | Status server |
| GET | `/docs` | API Documentation |
| GET | `/` | Hello message |

---

## 🔐 Authentication

### Roles yang Ada:
- **admin** → Full access (create, update, delete berita)
- **guru** → Update berita saja
- **siswa** → Read-only

### Cara Mengirim Token:
1. **Header**: `Authorization: Bearer YOUR_TOKEN`
2. Token dikirim dari API Gateway

---

## 📥 Import ke Postman

1. Buka Postman
2. Klik **Import** (tombol di kiri atas)
3. Pilih **File** → Upload file `Berita-API-Postman.json`
4. Collection akan otomatis terimpor dengan semua endpoint

---

## 🧪 Testing Flow Recommended

### 1. Verifikasi Service Running
```
GET /api/health
```

### 2. Test Categories (No Auth)
```
POST /api/categories  → Create kategori
GET /api/categories   → Lihat semua kategori
```

### 3. Test Berita (Dengan Auth)
```
POST /api/berita      → Create berita (ADMIN)
GET /api/berita       → List berita
GET /api/berita/:id   → Detail berita
PUT /api/berita/:id   → Update (ADMIN/GURU)
DELETE /api/berita/:id → Delete (ADMIN)
```

### 4. Test Pengumuman
```
POST /api/pengumuman  → Create
GET /api/pengumuman   → List
```

### 5. Test Agenda
```
POST /api/agenda      → Create
GET /api/agenda       → List
```

### 6. Test Search
```
GET /api/search?q=keyword
```

---

## ⚠️ Notes
- ❌ = Public (no auth needed)
- ✅ = Auth required (specific role)
- ⚠️ = Auth required (any role that can access)
- **Pagination**: Gunakan `?page=1&limit=10` pada GET requests
- **Uploads**: Semua file tersedia di `http://localhost:3003/uploads/`

---

## 🐛 Troubleshooting

### Port 3003 sudah terpakai?
```bash
docker compose up service-berita
```

### Token tidak valid?
- Pastikan token dikirim dengan format: `Bearer <token>`
- Token harus dari API Gateway dengan role yang sesuai

### Database error?
```bash
docker compose up -d  # Start semua services
```

---

**Status**: ✅ Ready to Test
**Last Updated**: 2026-05-04
