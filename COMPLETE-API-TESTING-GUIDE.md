# API Testing Guide - Sekolah Monorepo

Dokumentasi lengkap semua endpoint untuk testing di Postman.

## Setup Awal

1. **Import Postman Collection**: Gunakan file `COMPLETE-API-POSTMAN.json`
2. **Set JWT Token**: Gunakan variable `{{jwt_token}}` dengan token dari login
3. **Base URL**: Semua requests menggunakan `http://localhost:3000` (API Gateway)

---

## 1. API GATEWAY

### Health Check & Auth

| Method | Endpoint | Authentication | Deskripsi |
|--------|----------|-----------------|-----------|
| GET | `/health` | ❌ No | Check if API Gateway is running |
| GET | `/auth/me` | ✅ JWT Required | Get current authenticated user info |

---

## 2. SERVICE BERITA

### 2.1 Berita (News)

| Method | Endpoint | Auth | Access Level | Deskripsi |
|--------|----------|------|-------------|-----------|
| GET | `/api/berita` | ❌ | Public | Get all news (paginated) - Query: `page`, `limit` |
| GET | `/api/berita/:id` | ❌ | Public | Get news by ID |
| POST | `/api/berita` | ✅ | Admin | Create new news |
| PUT | `/api/berita/:id` | ✅ | Admin/Guru | Update news |
| DELETE | `/api/berita/:id` | ✅ | Admin | Delete news |

**Request Body (POST/PUT)**:
```json
{
  "judul": "Judul Berita",
  "isi": "Isi dari berita",
  "kategori_id": 1,
  "penulis": "Nama Penulis"
}
```

### 2.2 Categories

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/categories` | ❌ | Public | Get all categories |
| GET | `/api/categories/:id` | ❌ | Public | Get category by ID |
| POST | `/api/categories` | ✅ | Private | Create category |
| PUT | `/api/categories/:id` | ✅ | Private | Update category |
| PUT | `/api/categories/:id/toggle-active` | ✅ | Private | Toggle active status |
| DELETE | `/api/categories/:id` | ✅ | Private | Delete category |

**Request Body (POST/PUT)**:
```json
{
  "nama": "Kategori Baru",
  "deskripsi": "Deskripsi kategori"
}
```

### 2.3 Agenda (Jadwal)

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/agenda` | ❌ | Public | Get all agenda - Query: `page`, `limit`, `category` (optional) |
| GET | `/api/agenda/:id` | ❌ | Public | Get agenda by ID |
| POST | `/api/agenda` | ✅ | Private | Create agenda |
| PUT | `/api/agenda/:id` | ✅ | Private | Update agenda |
| PUT | `/api/agenda/:id/toggle-active` | ✅ | Private | Toggle active status |
| DELETE | `/api/agenda/:id` | ✅ | Private | Delete agenda |

**Request Body (POST/PUT)**:
```json
{
  "judul": "Agenda Baru",
  "deskripsi": "Deskripsi agenda",
  "tanggal_mulai": "2024-05-15",
  "tanggal_berakhir": "2024-05-20",
  "kategori_id": 1
}
```

### 2.4 Pengumuman (Announcements)

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/pengumuman` | ❌ | Public | Get all announcements - Query: `page`, `limit` |
| GET | `/api/pengumuman/:id` | ❌ | Public | Get announcement by ID |
| POST | `/api/pengumuman` | ✅ | Private | Create announcement |
| PUT | `/api/pengumuman/:id` | ✅ | Private | Update announcement |
| PUT | `/api/pengumuman/:id/toggle-active` | ✅ | Private | Toggle active status |
| DELETE | `/api/pengumuman/:id` | ✅ | Private | Delete announcement |

**Request Body (POST/PUT)**:
```json
{
  "judul": "Pengumuman Baru",
  "isi": "Isi pengumuman",
  "prioritas": "tinggi"
}
```

### 2.5 Search

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/search` | ❌ | Public | Search news & announcements - Query: `q` (required), `limit` (default: 20) |

**Example**: `/api/search?q=berita&limit=20`

---

## 3. SERVICE PROFILE

### 3.1 Fasilitas

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/profile/fasilitas` | ✅ | Private | Get all fasilitas |
| GET | `/api/profile/fasilitas/:id` | ✅ | Private | Get fasilitas by ID |
| POST | `/api/profile/fasilitas` | ✅ | Private | Create fasilitas (with optional photo) |
| PUT | `/api/profile/fasilitas/:id` | ✅ | Private | Update fasilitas (with optional photo) |
| DELETE | `/api/profile/fasilitas/:id` | ✅ | Private | Delete fasilitas |

**Form Data (POST/PUT)**:
- `nama` (text) - Nama fasilitas
- `deskripsi` (text) - Deskripsi fasilitas
- `foto` (file - optional) - File gambar

### 3.2 Visi Misi

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/profile/visi-misi` | ✅ | Private | Get all visi misi |
| GET | `/api/profile/visi-misi/:id` | ✅ | Private | Get visi misi by ID |
| POST | `/api/profile/visi-misi` | ✅ | Private | Create visi misi |
| PUT | `/api/profile/visi-misi/:id` | ✅ | Private | Update visi misi |
| DELETE | `/api/profile/visi-misi/:id` | ✅ | Private | Delete visi misi |

**Request Body (POST/PUT)**:
```json
{
  "visi": "Visi sekolah",
  "misi": "Misi sekolah"
}
```

### 3.3 Sejarah Identitas

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/profile/sejarah-identitas` | ✅ | Private | Get all sejarah identitas |
| GET | `/api/profile/sejarah-identitas/:id` | ✅ | Private | Get sejarah identitas by ID |
| POST | `/api/profile/sejarah-identitas` | ✅ | Private | Create sejarah identitas |
| PUT | `/api/profile/sejarah-identitas/:id` | ✅ | Private | Update sejarah identitas |
| DELETE | `/api/profile/sejarah-identitas/:id` | ✅ | Private | Delete sejarah identitas |

**Request Body (POST/PUT)**:
```json
{
  "sejarah": "Sejarah sekolah",
  "identitas": "Identitas sekolah"
}
```

### 3.4 Struktur Organisasi

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/profile/struktur-organisasi` | ✅ | Private | Get all struktur organisasi |
| GET | `/api/profile/struktur-organisasi/:id` | ✅ | Private | Get struktur organisasi by ID |
| POST | `/api/profile/struktur-organisasi` | ✅ | Private | Create struktur organisasi (image **required**) |
| PUT | `/api/profile/struktur-organisasi/:id` | ✅ | Private | Update struktur organisasi (image **required**) |
| DELETE | `/api/profile/struktur-organisasi/:id` | ✅ | Private | Delete struktur organisasi |

**Form Data (POST/PUT)**:
- `nama` (text) - Nama struktur
- `gambar` (file - **required**) - File gambar

### 3.5 Mitra Kerjasama

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/profile/mitra-kerjasama` | ✅ | Private | Get all mitra kerjasama |
| GET | `/api/profile/mitra-kerjasama/:id` | ✅ | Private | Get mitra kerjasama by ID |
| POST | `/api/profile/mitra-kerjasama` | ✅ | Private | Create mitra kerjasama (with optional logo) |
| PUT | `/api/profile/mitra-kerjasama/:id` | ✅ | Private | Update mitra kerjasama (with optional logo) |
| DELETE | `/api/profile/mitra-kerjasama/:id` | ✅ | Private | Delete mitra kerjasama |

**Form Data (POST/PUT)**:
- `nama` (text) - Nama mitra
- `deskripsi` (text) - Deskripsi mitra
- `logo` (file - optional) - File logo

### 3.6 Program Keahlian

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/profile/program-keahlian` | ✅ | Private | Get all program keahlian |
| GET | `/api/profile/program-keahlian/:id` | ✅ | Private | Get program keahlian by ID |
| POST | `/api/profile/program-keahlian` | ✅ | Private | Create program keahlian |
| PUT | `/api/profile/program-keahlian/:id` | ✅ | Private | Update program keahlian |
| DELETE | `/api/profile/program-keahlian/:id` | ✅ | Private | Delete program keahlian |

**Request Body (POST/PUT)**:
```json
{
  "nama": "Program Keahlian Baru",
  "deskripsi": "Deskripsi program"
}
```

### 3.7 Prestasi

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/profile/prestasi` | ✅ | Private | Get all prestasi |
| GET | `/api/profile/prestasi/:id` | ✅ | Private | Get prestasi by ID |
| POST | `/api/profile/prestasi` | ✅ | Private | Create prestasi |
| PUT | `/api/profile/prestasi/:id` | ✅ | Private | Update prestasi |
| DELETE | `/api/profile/prestasi/:id` | ✅ | Private | Delete prestasi |

**Request Body (POST/PUT)**:
```json
{
  "nama": "Prestasi Baru",
  "deskripsi": "Deskripsi prestasi",
  "tahun": 2024
}
```

---

## 4. SERVICE PORTOFOLIO

### Portfolio Management

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| POST | `/api/portofolio` | ✅ | Siswa | Create portfolio |
| GET | `/api/portofolio` | ✅ | Private | Get all portfolios (paginated) |
| GET | `/api/portofolio/review` | ✅ | Admin | Get portfolios for review |
| GET | `/api/portofolio/me` | ✅ | Siswa | Get user's own portfolios |
| GET | `/api/portofolio/:id` | ✅ | Private | Get portfolio by ID |
| PUT | `/api/portofolio/:id` | ✅ | Siswa | Update portfolio |
| DELETE | `/api/portofolio/:id` | ✅ | Siswa | Delete portfolio |
| PUT | `/api/portofolio/:id/submit` | ✅ | Siswa | Submit portfolio for review |
| PUT | `/api/portofolio/:id/publish` | ✅ | Admin | Publish portfolio |
| PUT | `/api/portofolio/:id/reject` | ✅ | Admin | Reject portfolio |

**Request Body (POST/PUT)**:
```json
{
  "title": "Portfolio Baru",
  "description": "Deskripsi portfolio",
  "category": "kategori",
  "tags": ["tag1", "tag2"]
}
```

**Request Body (Reject)**:
```json
{
  "reason": "Alasan penolakan"
}
```

---

## 5. SERVICE PELANGGARAN

### Surat Panggilan

| Method | Endpoint | Auth | Access | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/pelanggaran/surat-panggilan/master/siswa` | ✅ | Private | Get master data all siswa |
| GET | `/api/pelanggaran/surat-panggilan/master/guru` | ✅ | Private | Get master data all guru |
| POST | `/api/pelanggaran/surat-panggilan` | ✅ | Private | Create surat panggilan |
| PUT | `/api/pelanggaran/surat-panggilan/:id` | ✅ | Private | Update surat panggilan |
| GET | `/api/pelanggaran/surat-panggilan` | ✅ | Private | Get all surat panggilan |
| DELETE | `/api/pelanggaran/surat-panggilan/:id` | ✅ | Private | Delete surat panggilan |
| GET | `/api/pelanggaran/surat-panggilan/:id/pdf` | ✅ | Private | Download PDF surat |
| GET | `/api/pelanggaran/surat-panggilan/:id/whatsapp` | ✅ | Private | Generate WhatsApp link |
| PUT | `/api/pelanggaran/surat-panggilan/:id/selesai` | ✅ | Private | Mark as completed |
| PUT | `/api/pelanggaran/surat-panggilan/:id/batalkan` | ✅ | Private | Cancel surat |

**Request Body (POST/PUT)**:
```json
{
  "siswa_id": 1,
  "guru_id": 1,
  "pelanggaran": "Deskripsi pelanggaran",
  "tanggal": "2024-05-15",
  "jam": "14:00"
}
```

---

## Testing Checklist

### Phase 1: Public Endpoints (No Auth Required)
- [ ] GET `/health` - Health check API Gateway
- [ ] GET `/api/berita` - Get all news
- [ ] GET `/api/berita/1` - Get news by ID
- [ ] GET `/api/categories` - Get all categories
- [ ] GET `/api/categories/1` - Get category by ID
- [ ] GET `/api/agenda` - Get all agenda
- [ ] GET `/api/agenda/1` - Get agenda by ID
- [ ] GET `/api/pengumuman` - Get all announcements
- [ ] GET `/api/pengumuman/1` - Get announcement by ID
- [ ] GET `/api/search?q=test` - Search functionality

### Phase 2: Authentication & Protected Endpoints
- [ ] POST `/auth/me` - Get current user (with JWT token)
- [ ] GET `/api/profile/fasilitas` - Requires JWT
- [ ] GET `/api/profile/visi-misi` - Requires JWT
- [ ] GET `/api/profile/prestasi` - Requires JWT

### Phase 3: CRUD Operations
- [ ] POST create operations (Berita, Categories, Agenda, etc.)
- [ ] PUT update operations
- [ ] DELETE delete operations
- [ ] PUT toggle-active operations

### Phase 4: File Upload
- [ ] POST `/api/profile/fasilitas` (with foto)
- [ ] POST `/api/profile/struktur-organisasi` (with gambar - required)
- [ ] POST `/api/profile/mitra-kerjasama` (with logo - optional)

### Phase 5: Complex Operations
- [ ] Portfolio: submit → review → publish/reject workflow
- [ ] Surat Panggilan: create → download PDF → WhatsApp link
- [ ] Master data queries

---

## Authentication Setup

### Getting JWT Token

1. Contact the authentication service to get a token
2. Set the token in Postman environment variable: `jwt_token`
3. Use in header: `Authorization: Bearer {{jwt_token}}`

All protected endpoints require:
```
Header: Authorization: Bearer {{jwt_token}}
```

---

## Notes

- **Port**: API Gateway berjalan di port `3000`
- **All Services**: Diakses melalui API Gateway (reverse proxy)
- **Pagination**: Default page=1, limit=10 (atau sesuai endpoint)
- **File Uploads**: Gunakan form-data dalam Postman
- **Response Format**: JSON

---

## Endpoints Summary by Service

| Service | Endpoints | Public | Private |
|---------|-----------|--------|---------|
| API Gateway | 2 | 1 | 1 |
| Berita | 23 | 14 | 9 |
| Profile | 42 | 0 | 42 |
| Portofolio | 10 | 0 | 10 |
| Pelanggaran | 10 | 0 | 10 |
| **TOTAL** | **87** | **15** | **72** |
