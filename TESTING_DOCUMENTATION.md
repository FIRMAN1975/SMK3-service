# 📋 DOKUMENTASI TESTING ENDPOINT MONOREPO SEKOLAH

## 🎯 Struktur Testing

Base URL: `http://localhost:PORT/api`

### Authentication
- **Public Endpoints**: Tidak memerlukan JWT token
- **Protected Endpoints**: Memerlukan `Authorization: Bearer {JWT_TOKEN}`
- **Role-based**: ADMIN, GURU, SISWA

---

## 🚀 SERVICE 1: API-GATEWAY (Port: biasanya 3000)

### 1.1 Health Check
**Endpoint**: `GET /health`
- **Akses**: Public
- **Response**:
```json
{
  "status": "ok",
  "service": "api-gateway",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Test Steps**:
1. Buka Postman/Thunder Client
2. GET `http://localhost:3000/health`
3. Verifikasi status = "ok"

### 1.2 Get Current User Info
**Endpoint**: `GET /auth/me`
- **Akses**: Protected (Require JWT)
- **Header**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "userId": "123",
  "username": "admin_user",
  "roles": ["ADMIN"]
}
```
**Test Steps**:
1. Login terlebih dahulu untuk mendapat JWT token
2. GET `http://localhost:3000/auth/me`
3. Tambahkan Header: `Authorization: Bearer {token_yang_didapat}`
4. Verifikasi response menunjukkan user info

---

## 📰 SERVICE 2: SERVICE-BERITA (Port: 3001)

### 2.1 BERITA (News)

#### 2.1.1 Get All News
**Endpoint**: `GET /api/berita`
- **Akses**: Public
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)
- **Response**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Judul Berita",
      "content": "Isi berita...",
      "author": "admin",
      "createdAt": "2024-01-01"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```
**Test Steps**:
1. GET `http://localhost:3000/api/berita?page=1&limit=10`
2. Verifikasi data daftar berita
3. Test pagination dengan page=2, limit=5

#### 2.1.2 Get News Detail
**Endpoint**: `GET /api/berita/:id`
- **Akses**: Public
- **Response**:
```json
{
  "id": 1,
  "title": "Judul Berita",
  "content": "Isi berita lengkap...",
  "author": "admin",
  "categoryId": 1,
  "createdAt": "2024-01-01"
}
```
**Test Steps**:
1. GET `http://localhost:3000/api/berita/1`
2. Verifikasi detail berita muncul
3. Test dengan id yang tidak ada (error 404)

#### 2.1.3 Create News
**Endpoint**: `POST /api/berita`
- **Akses**: Protected (ADMIN only)
- **Body**:
```json
{
  "title": "Berita Baru",
  "content": "Isi berita...",
  "categoryId": 1
}
```
**Test Steps**:
1. POST `http://localhost:3000/api/berita`
2. Header: `Authorization: Bearer {admin_token}`
3. Body JSON seperti di atas
4. Verifikasi status 201 Created
5. Test dengan token GURU (harus reject)

#### 2.1.4 Update News
**Endpoint**: `PUT /api/berita/:id`
- **Akses**: Protected (ADMIN, GURU)
- **Body**:
```json
{
  "title": "Judul Diubah",
  "content": "Isi diubah...",
  "categoryId": 1
}
```
**Test Steps**:
1. PUT `http://localhost:3000/api/berita/1`
2. Header: `Authorization: Bearer {admin_or_guru_token}`
3. Verifikasi berita ter-update
4. Test dengan SISWA (harus reject)

#### 2.1.5 Delete News
**Endpoint**: `DELETE /api/berita/:id`
- **Akses**: Protected (ADMIN only)
**Test Steps**:
1. DELETE `http://localhost:3000/api/berita/1`
2. Header: `Authorization: Bearer {admin_token}`
3. Verifikasi status 200/204
4. Verify berita sudah dihapus (GET akan return 404)

---

### 2.2 CATEGORIES (Kategori Berita)

#### 2.2.1 Get All Categories
**Endpoint**: `GET /api/categories`
- **Akses**: Public
- **Response**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Teknologi",
      "slug": "teknologi",
      "isActive": true
    }
  ]
}
```
**Test Steps**:
1. GET `http://localhost:3000/api/categories`
2. Verifikasi list kategori

#### 2.2.2 Get Category Detail
**Endpoint**: `GET /api/categories/:id`
- **Akses**: Public
**Test Steps**:
1. GET `http://localhost:3000/api/categories/1`
2. Verifikasi detail kategori

#### 2.2.3 Create Category
**Endpoint**: `POST /api/categories`
- **Akses**: Protected (ADMIN only)
- **Body**:
```json
{
  "name": "Kategori Baru",
  "slug": "kategori-baru"
}
```
**Test Steps**:
1. POST dengan ADMIN token
2. Verifikasi kategori tercipta

#### 2.2.4 Update Category
**Endpoint**: `PUT /api/categories/:id`
- **Akses**: Protected (ADMIN only)
- **Body**:
```json
{
  "name": "Nama Diubah",
  "slug": "nama-diubah"
}
```
**Test Steps**:
1. PUT `http://localhost:3000/api/categories/1`
2. Verifikasi terupdate

#### 2.2.5 Toggle Category Status
**Endpoint**: `PUT /api/categories/:id/toggle-active`
- **Akses**: Protected (ADMIN only)
**Test Steps**:
1. PUT `http://localhost:3000/api/categories/1/toggle-active`
2. Verifikasi isActive berubah

#### 2.2.6 Delete Category
**Endpoint**: `DELETE /api/categories/:id`
- **Akses**: Protected (ADMIN only)
**Test Steps**:
1. DELETE `http://localhost:3000/api/categories/1`
2. Verifikasi terhapus

---

### 2.3 PENGUMUMAN (Announcements)

#### 2.3.1 Get All Announcements
**Endpoint**: `GET /api/pengumuman`
- **Akses**: Public
- **Query**: page, limit
**Test Steps**:
1. GET `http://localhost:3000/api/pengumuman?page=1&limit=10`
2. Verifikasi list pengumuman

#### 2.3.2 Get Announcement Detail
**Endpoint**: `GET /api/pengumuman/:id`
- **Akses**: Public
**Test Steps**:
1. GET `http://localhost:3000/api/pengumuman/1`
2. Verifikasi detail

#### 2.3.3 Create Announcement
**Endpoint**: `POST /api/pengumuman`
- **Akses**: Protected (ADMIN only)
- **Body**:
```json
{
  "title": "Pengumuman Penting",
  "content": "Isi pengumuman...",
  "priority": "HIGH"
}
```
**Test Steps**:
1. POST dengan ADMIN token
2. Verifikasi pengumuman tercipta

#### 2.3.4 Update Announcement
**Endpoint**: `PUT /api/pengumuman/:id`
- **Akses**: Protected (ADMIN only)
**Test Steps**:
1. PUT dengan perubahan data
2. Verifikasi terupdate

#### 2.3.5 Toggle Announcement Status
**Endpoint**: `PUT /api/pengumuman/:id/toggle-active`
- **Akses**: Protected (ADMIN only)
**Test Steps**:
1. PUT untuk toggle status
2. Verifikasi status berubah

#### 2.3.6 Delete Announcement
**Endpoint**: `DELETE /api/pengumuman/:id`
- **Akses**: Protected (ADMIN only)
**Test Steps**:
1. DELETE untuk hapus
2. Verifikasi terhapus

---

### 2.4 AGENDA (Schedule)

#### 2.4.1 Get All Agenda
**Endpoint**: `GET /api/agenda`
- **Akses**: Public
- **Query**: page, limit, category
- **Response**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Upacara Bendera",
      "description": "Upacara bendera rutin",
      "startDate": "2024-01-01",
      "endDate": "2024-01-01",
      "category": "akademik",
      "isActive": true
    }
  ]
}
```
**Test Steps**:
1. GET `http://localhost:3000/api/agenda?page=1&limit=100`
2. Test dengan category filter: `?category=akademik`
3. Verifikasi list agenda

#### 2.4.2 Get Agenda Detail
**Endpoint**: `GET /api/agenda/:id`
- **Akses**: Public
**Test Steps**:
1. GET `http://localhost:3000/api/agenda/1`
2. Verifikasi detail

#### 2.4.3 Create Agenda
**Endpoint**: `POST /api/agenda`
- **Akses**: Protected (ADMIN only)
- **Body**:
```json
{
  "title": "Event Baru",
  "description": "Deskripsi event",
  "startDate": "2024-02-01",
  "endDate": "2024-02-01",
  "category": "akademik"
}
```
**Test Steps**:
1. POST dengan ADMIN token
2. Verifikasi agenda tercipta

#### 2.4.4 Update Agenda
**Endpoint**: `PUT /api/agenda/:id`
- **Akses**: Protected (ADMIN only)
**Test Steps**:
1. PUT dengan data perubahan
2. Verifikasi terupdate

#### 2.4.5 Toggle Agenda Status
**Endpoint**: `PUT /api/agenda/:id/toggle-active`
- **Akses**: Protected (ADMIN only)
**Test Steps**:
1. PUT untuk toggle
2. Verifikasi status berubah

#### 2.4.6 Delete Agenda
**Endpoint**: `DELETE /api/agenda/:id`
- **Akses**: Protected (ADMIN only)
**Test Steps**:
1. DELETE untuk hapus
2. Verifikasi terhapus

---

### 2.5 SEARCH (Pencarian Global)

#### 2.5.1 Search News & Announcements
**Endpoint**: `GET /api/search`
- **Akses**: Public
- **Query**:
  - `q` (keyword, required)
  - `limit` (default: 20)
- **Response**:
```json
{
  "news": [
    {
      "id": 1,
      "title": "Hasil pencarian",
      "content": "..."
    }
  ],
  "announcements": [
    {
      "id": 1,
      "title": "Pengumuman hasil",
      "content": "..."
    }
  ],
  "keyword": "teknologi"
}
```
**Test Steps**:
1. GET `http://localhost:3000/api/search?q=teknologi&limit=20`
2. Verifikasi pencarian mengembalikan hasil
3. Test dengan keyword yang tidak ada
4. Test tanpa query (harus return empty)

---

## 🎓 SERVICE 3: SERVICE-PROFILE (Port: 3002)

### 3.1 PRESTASI (Achievements)

#### 3.1.1 Get All Achievements
**Endpoint**: `GET /api/profile/prestasi`
- **Akses**: Public
**Test Steps**:
1. GET `http://localhost:3000/api/profile/prestasi`
2. Verifikasi list prestasi

#### 3.1.2 Get Achievement Detail
**Endpoint**: `GET /api/profile/prestasi/:id`
- **Akses**: Public
**Test Steps**:
1. GET `http://localhost:3000/api/profile/prestasi/1`
2. Verifikasi detail

#### 3.1.3 Create Achievement
**Endpoint**: `POST /api/profile/prestasi`
- **Akses**: Protected (ADMIN)
- **Body**:
```json
{
  "name": "Juara Kompetisi",
  "description": "Deskripsi prestasi",
  "year": 2024,
  "level": "Nasional"
}
```
**Test Steps**:
1. POST dengan ADMIN token
2. Verifikasi tercipta

#### 3.1.4 Update Achievement
**Endpoint**: `PUT /api/profile/prestasi/:id`
- **Akses**: Protected (ADMIN)
**Test Steps**:
1. PUT dengan data perubahan
2. Verifikasi terupdate

#### 3.1.5 Delete Achievement
**Endpoint**: `DELETE /api/profile/prestasi/:id`
- **Akses**: Protected (ADMIN)
**Test Steps**:
1. DELETE untuk hapus
2. Verifikasi terhapus

---

### 3.2 VISI & MISI

#### 3.2.1 Get All Visi-Misi
**Endpoint**: `GET /api/profile/visi-misi`
- **Akses**: Public
**Test Steps**:
1. GET `http://localhost:3000/api/profile/visi-misi`
2. Verifikasi list

#### 3.2.2 Get Detail Visi-Misi
**Endpoint**: `GET /api/profile/visi-misi/:id`
- **Akses**: Public
**Test Steps**:
1. GET detail
2. Verifikasi response

#### 3.2.3 Create Visi-Misi
**Endpoint**: `POST /api/profile/visi-misi`
- **Akses**: Protected (ADMIN)
- **Body**:
```json
{
  "title": "Visi",
  "content": "Isi visi...",
  "type": "visi"
}
```
**Test Steps**:
1. POST dengan data
2. Verifikasi tercipta

#### 3.2.4 Update
**Endpoint**: `PUT /api/profile/visi-misi/:id`
- **Akses**: Protected (ADMIN)
**Test Steps**:
1. PUT untuk update
2. Verifikasi terupdate

#### 3.2.5 Delete
**Endpoint**: `DELETE /api/profile/visi-misi/:id`
- **Akses**: Protected (ADMIN)
**Test Steps**:
1. DELETE untuk hapus
2. Verifikasi terhapus

---

### 3.3 PROGRAM KEAHLIAN (Skill Programs)

#### 3.3.1 Get All Programs
**Endpoint**: `GET /api/profile/program-keahlian`
- **Akses**: Public
**Test Steps**:
1. GET list program
2. Verifikasi response

#### 3.3.2 Get Program Detail
**Endpoint**: `GET /api/profile/program-keahlian/:id`
- **Akses**: Public
**Test Steps**:
1. GET detail
2. Verifikasi response

#### 3.3.3 Create Program
**Endpoint**: `POST /api/profile/program-keahlian`
- **Akses**: Protected (ADMIN)
- **Body**:
```json
{
  "name": "Teknik Informatika",
  "description": "Deskripsi program",
  "year": 2024
}
```
**Test Steps**:
1. POST dengan data
2. Verifikasi tercipta

#### 3.3.4 Update Program
**Endpoint**: `PUT /api/profile/program-keahlian/:id`
- **Akses**: Protected (ADMIN)
**Test Steps**:
1. PUT untuk update
2. Verifikasi terupdate

#### 3.3.5 Delete Program
**Endpoint**: `DELETE /api/profile/program-keahlian/:id`
- **Akses**: Protected (ADMIN)
**Test Steps**:
1. DELETE untuk hapus
2. Verifikasi terhapus

---

### 3.4 FASILITAS (Facilities) - WITH FILE UPLOAD

#### 3.4.1 Get All Facilities
**Endpoint**: `GET /api/profile/fasilitas`
- **Akses**: Public
**Test Steps**:
1. GET list fasilitas
2. Verifikasi response

#### 3.4.2 Get Facility Detail
**Endpoint**: `GET /api/profile/fasilitas/:id`
- **Akses**: Public
**Test Steps**:
1. GET detail
2. Verifikasi response

#### 3.4.3 Create Facility (WITH IMAGE)
**Endpoint**: `POST /api/profile/fasilitas`
- **Akses**: Protected (ADMIN)
- **Content-Type**: multipart/form-data
- **Form Data**:
  - `name`: Nama Fasilitas
  - `description`: Deskripsi
  - `foto`: File image (jpg, jpeg, png, webp)
**Test Steps**:
1. POST dengan form-data (bukan JSON)
2. Sertakan file gambar (max type: jpg, png, jpeg, webp)
3. Verifikasi tercipta dengan path foto

#### 3.4.4 Update Facility (WITH IMAGE)
**Endpoint**: `PUT /api/profile/fasilitas/:id`
- **Akses**: Protected (ADMIN)
- **Content-Type**: multipart/form-data
**Test Steps**:
1. PUT dengan form-data
2. Optional upload foto baru
3. Verifikasi terupdate

#### 3.4.5 Delete Facility
**Endpoint**: `DELETE /api/profile/fasilitas/:id`
- **Akses**: Protected (ADMIN)
**Test Steps**:
1. DELETE untuk hapus
2. Verifikasi terhapus

---

### 3.5 STRUKTUR ORGANISASI (Organization Structure) - WITH FILE UPLOAD

#### 3.5.1 Get All Structures
**Endpoint**: `GET /api/profile/struktur-organisasi`
- **Akses**: Public
**Test Steps**:
1. GET list struktur
2. Verifikasi response

#### 3.5.2 Get Structure Detail
**Endpoint**: `GET /api/profile/struktur-organisasi/:id`
- **Akses**: Public
**Test Steps**:
1. GET detail
2. Verifikasi response

#### 3.5.3 Create Structure (WITH IMAGE - REQUIRED)
**Endpoint**: `POST /api/profile/struktur-organisasi`
- **Akses**: Protected (ADMIN)
- **Content-Type**: multipart/form-data
- **Form Data**:
  - `gambar`: File image (REQUIRED) - jpg, jpeg, png, webp
**Test Steps**:
1. POST dengan form-data
2. **File gambar WAJIB** (akan error 400 jika tidak ada)
3. Verifikasi tercipta

#### 3.5.4 Update Structure (WITH IMAGE - REQUIRED)
**Endpoint**: `PUT /api/profile/struktur-organisasi/:id`
- **Akses**: Protected (ADMIN)
- **Content-Type**: multipart/form-data
- **Form Data**:
  - `gambar`: File image (REQUIRED)
**Test Steps**:
1. PUT dengan form-data
2. File wajib diupload
3. Verifikasi terupdate

#### 3.5.5 Delete Structure
**Endpoint**: `DELETE /api/profile/struktur-organisasi/:id`
- **Akses**: Protected (ADMIN)
**Test Steps**:
1. DELETE untuk hapus
2. Verifikasi terhapus

---

### 3.6 SEJARAH & IDENTITAS (History & Identity)

#### 3.6.1 Get All
**Endpoint**: `GET /api/profile/sejarah-identitas`
- **Akses**: Public
**Test Steps**:
1. GET list
2. Verifikasi response

#### 3.6.2 Get Detail
**Endpoint**: `GET /api/profile/sejarah-identitas/:id`
- **Akses**: Public
**Test Steps**:
1. GET detail
2. Verifikasi response

#### 3.6.3 Create
**Endpoint**: `POST /api/profile/sejarah-identitas`
- **Akses**: Protected (ADMIN)
- **Body**:
```json
{
  "title": "Sejarah Sekolah",
  "content": "Isi sejarah...",
  "year": 2024
}
```
**Test Steps**:
1. POST dengan data
2. Verifikasi tercipta

#### 3.6.4 Update
**Endpoint**: `PUT /api/profile/sejarah-identitas/:id`
- **Akses**: Protected (ADMIN)
**Test Steps**:
1. PUT untuk update
2. Verifikasi terupdate

#### 3.6.5 Delete
**Endpoint**: `DELETE /api/profile/sejarah-identitas/:id`
- **Akses**: Protected (ADMIN)
**Test Steps**:
1. DELETE untuk hapus
2. Verifikasi terhapus

---

### 3.7 MITRA KERJASAMA (Partnerships) - WITH FILE UPLOAD

#### 3.7.1 Get All Partnerships
**Endpoint**: `GET /api/profile/mitra-kerjasama`
- **Akses**: Public
**Test Steps**:
1. GET list kemitraan
2. Verifikasi response

#### 3.7.2 Get Partnership Detail
**Endpoint**: `GET /api/profile/mitra-kerjasama/:id`
- **Akses**: Public
**Test Steps**:
1. GET detail
2. Verifikasi response

#### 3.7.3 Create Partnership (WITH LOGO)
**Endpoint**: `POST /api/profile/mitra-kerjasama`
- **Akses**: Protected (ADMIN)
- **Content-Type**: multipart/form-data
- **Form Data**:
  - `name`: Nama Mitra
  - `description`: Deskripsi
  - `logo`: File image (jpg, jpeg, png, webp, svg+xml)
**Test Steps**:
1. POST dengan form-data
2. Logo optional (dapat di-upload atau tidak)
3. Verifikasi tercipta

#### 3.7.4 Update Partnership (WITH LOGO)
**Endpoint**: `PUT /api/profile/mitra-kerjasama/:id`
- **Akses**: Protected (ADMIN)
- **Content-Type**: multipart/form-data
**Test Steps**:
1. PUT dengan form-data
2. Optional upload logo baru
3. Verifikasi terupdate

#### 3.7.5 Delete Partnership
**Endpoint**: `DELETE /api/profile/mitra-kerjasama/:id`
- **Akses**: Protected (ADMIN)
**Test Steps**:
1. DELETE untuk hapus
2. Verifikasi terhapus

---

## 🎯 SERVICE 4: SERVICE-PORTOFOLIO (Port: 3003)

### 4.1 PORTFOLIO CRUD

#### 4.1.1 Get All Portfolios
**Endpoint**: `GET /api/portofolio`
- **Akses**: Public
- **Query**: page, limit, status
- **Response**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Proyek Website",
      "description": "Deskripsi proyek",
      "studentId": "siswa123",
      "status": "published",
      "createdAt": "2024-01-01"
    }
  ]
}
```
**Test Steps**:
1. GET `http://localhost:3000/api/portofolio`
2. Verifikasi list portfolio
3. Test dengan filter status

#### 4.1.2 Get Portfolio Detail
**Endpoint**: `GET /api/portofolio/:id`
- **Akses**: Public
**Test Steps**:
1. GET `http://localhost:3000/api/portofolio/1`
2. Verifikasi detail portfolio

#### 4.1.3 Create Portfolio
**Endpoint**: `POST /api/portofolio`
- **Akses**: Protected (SISWA)
- **Body**:
```json
{
  "title": "Proyek Baru",
  "description": "Deskripsi proyek",
  "technologies": ["React", "Node.js"],
  "githubUrl": "https://github.com/...",
  "demoUrl": "https://demo.com"
}
```
**Test Steps**:
1. POST dengan SISWA token
2. Verifikasi tercipta dengan status "draft"
3. Test dengan GURU (harus reject)

#### 4.1.4 Update Portfolio
**Endpoint**: `PUT /api/portofolio/:id`
- **Akses**: Protected (SISWA)
- **Body**: Data perubahan
**Test Steps**:
1. PUT `http://localhost:3000/api/portofolio/1`
2. Header: `Authorization: Bearer {siswa_token}`
3. Verifikasi terupdate

#### 4.1.5 Delete Portfolio
**Endpoint**: `DELETE /api/portofolio/:id`
- **Akses**: Protected (SISWA)
**Test Steps**:
1. DELETE dengan SISWA token yang membuat
2. Verifikasi terhapus

---

### 4.2 PORTFOLIO WORKFLOW

#### 4.2.1 Submit Portfolio for Review
**Endpoint**: `PUT /api/portofolio/:id/submit`
- **Akses**: Protected (SISWA)
- **Effect**: Status berubah dari draft → submitted
**Test Steps**:
1. PUT `http://localhost:3000/api/portofolio/1/submit`
2. Verifikasi status = "submitted"

#### 4.2.2 Admin: Get Portfolios for Review
**Endpoint**: `GET /api/portofolio/review`
- **Akses**: Protected (ADMIN only)
- **Effect**: Lihat daftar portfolio yang menunggu review
**Test Steps**:
1. GET `http://localhost:3000/api/portofolio/review`
2. Header: ADMIN token
3. Verifikasi list portfolio status "submitted"

#### 4.2.3 Admin: Publish Portfolio
**Endpoint**: `PUT /api/portofolio/:id/publish`
- **Akses**: Protected (ADMIN)
- **Effect**: Status → "published"
**Test Steps**:
1. PUT `http://localhost:3000/api/portofolio/1/publish`
2. Header: ADMIN token
3. Verifikasi status = "published"

#### 4.2.4 Admin: Reject Portfolio
**Endpoint**: `PUT /api/portofolio/:id/reject`
- **Akses**: Protected (ADMIN)
- **Body**:
```json
{
  "reason": "Alasan penolakan"
}
```
**Test Steps**:
1. PUT dengan ADMIN token + reason
2. Verifikasi status = "rejected"

#### 4.2.5 Get My Portfolios (Siswa)
**Endpoint**: `GET /api/portofolio/me`
- **Akses**: Protected (SISWA)
- **Effect**: Lihat portfolio milik siswa yang login
**Test Steps**:
1. GET `http://localhost:3000/api/portofolio/me`
2. Header: SISWA token
3. Verifikasi hanya portfolio milik siswa tersebut

---

## ⚠️ SERVICE 5: SERVICE-PELANGGARAN (Port: 3004)

### 5.1 MASTER DATA

#### 5.1.1 Get Master Siswa
**Endpoint**: `GET /api/pelanggaran/surat-panggilan/master/siswa`
- **Akses**: Protected (ADMIN)
- **Response**: List semua siswa
**Test Steps**:
1. GET dengan ADMIN token
2. Verifikasi list siswa

#### 5.1.2 Get Master Guru
**Endpoint**: `GET /api/pelanggaran/surat-panggilan/master/guru`
- **Akses**: Protected (ADMIN)
- **Response**: List semua guru
**Test Steps**:
1. GET dengan ADMIN token
2. Verifikasi list guru

---

### 5.2 SURAT PANGGILAN (Violation Letters) CRUD

#### 5.2.1 Get All Letters
**Endpoint**: `GET /api/pelanggaran/surat-panggilan`
- **Akses**: Protected (ADMIN)
- **Response**:
```json
{
  "data": [
    {
      "id": "SP001",
      "studentId": "siswa123",
      "studentName": "Nama Siswa",
      "violation": "Terlambat",
      "severity": "ringan",
      "status": "draft",
      "createdAt": "2024-01-01"
    }
  ]
}
```
**Test Steps**:
1. GET dengan ADMIN token
2. Verifikasi list surat

#### 5.2.2 Create Surat Panggilan
**Endpoint**: `POST /api/pelanggaran/surat-panggilan`
- **Akses**: Protected (ADMIN)
- **Body**:
```json
{
  "studentId": "siswa123",
  "violation": "Terlambat 3 kali",
  "severity": "sedang",
  "notes": "Catatan tambahan"
}
```
**Test Steps**:
1. POST dengan data
2. Verifikasi tercipta

#### 5.2.3 Update Surat Panggilan
**Endpoint**: `PUT /api/pelanggaran/surat-panggilan/:id`
- **Akses**: Protected (ADMIN)
- **Body**: Data perubahan
**Test Steps**:
1. PUT dengan data baru
2. Verifikasi terupdate

#### 5.2.4 Delete Surat Panggilan
**Endpoint**: `DELETE /api/pelanggaran/surat-panggilan/:id`
- **Akses**: Protected (ADMIN)
**Test Steps**:
1. DELETE surat
2. Verifikasi terhapus

---

### 5.3 AKSI & INTEGRASI

#### 5.3.1 Download PDF Surat
**Endpoint**: `GET /api/pelanggaran/surat-panggilan/:id/pdf`
- **Akses**: Protected (ADMIN)
- **Response**: File PDF
**Test Steps**:
1. GET dengan ADMIN token
2. Browser akan download file PDF
3. Verifikasi file dapat dibuka

#### 5.3.2 Generate WhatsApp Link
**Endpoint**: `GET /api/pelanggaran/surat-panggilan/:id/whatsapp`
- **Akses**: Protected (ADMIN)
- **Response**:
```json
{
  "whatsappUrl": "https://wa.me/...",
  "message": "Teks pesan WhatsApp"
}
```
**Test Steps**:
1. GET dengan ADMIN token
2. Verifikasi WhatsApp link terbentuk
3. Klik link untuk buka WhatsApp

#### 5.3.3 Mark Letter as Done
**Endpoint**: `PUT /api/pelanggaran/surat-panggilan/:id/selesai`
- **Akses**: Protected (ADMIN)
- **Effect**: Status → "completed"
**Test Steps**:
1. PUT dengan ADMIN token
2. Verifikasi status = "completed"

#### 5.3.4 Cancel Letter
**Endpoint**: `PUT /api/pelanggaran/surat-panggilan/:id/batalkan`
- **Akses**: Protected (ADMIN)
- **Effect**: Status → "cancelled"
**Test Steps**:
1. PUT dengan ADMIN token
2. Verifikasi status = "cancelled"

---

## ⚙️ SERVICE 6: SERVICE-MANAGEMENT (Port: 3005)

Service ini merupakan proxy management, akses melalui gateway:

**Endpoint**: `ALL /api/management/*`
- **Akses**: Protected (ADMIN only)
- **Methods**: GET, POST, PUT, DELETE

**Test Steps**:
1. GET `http://localhost:3000/api/management/`
2. Header: ADMIN token
3. Verifikasi response dari management service

---

## 📋 RINGKASAN TEST CHECKLIST

### Public Endpoints (Tidak perlu login)
- ✅ GET /health (Gateway)
- ✅ GET /api/berita
- ✅ GET /api/berita/:id
- ✅ GET /api/categories
- ✅ GET /api/categories/:id
- ✅ GET /api/pengumuman
- ✅ GET /api/pengumuman/:id
- ✅ GET /api/agenda
- ✅ GET /api/agenda/:id
- ✅ GET /api/search
- ✅ GET /api/profile/*
- ✅ GET /api/portofolio
- ✅ GET /api/portofolio/:id
- ✅ GET /api/profile/uploads/*

### Protected Endpoints (Perlu login)
- ✅ GET /auth/me (All authenticated users)
- ✅ POST/PUT/DELETE /api/berita (ADMIN/GURU)
- ✅ POST/PUT/DELETE /api/categories (ADMIN)
- ✅ POST/PUT/DELETE /api/pengumuman (ADMIN)
- ✅ POST/PUT/DELETE /api/agenda (ADMIN)
- ✅ POST/PUT/DELETE /api/profile/* (ADMIN)
- ✅ POST/PUT/DELETE /api/portofolio/* (SISWA/ADMIN)
- ✅ POST/PUT/DELETE /api/pelanggaran/* (ADMIN)
- ✅ ALL /api/management/* (ADMIN)

---

## 🔐 TESTING DENGAN POSTMAN/THUNDER CLIENT

### Langkah Setup:
1. **Buat Collection** bernama "Sekolah Monorepo"
2. **Setup Environment Variable**:
```
{
  "base_url": "http://localhost:3000",
  "admin_token": "{JWT_TOKEN_ADMIN}",
  "guru_token": "{JWT_TOKEN_GURU}",
  "siswa_token": "{JWT_TOKEN_SISWA}",
  "service_berita_url": "http://localhost:3001",
  "service_profile_url": "http://localhost:3002",
  "service_portofolio_url": "http://localhost:3003",
  "service_pelanggaran_url": "http://localhost:3004"
}
```

3. **Contoh Request**:
```
GET {{base_url}}/api/berita
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

---

## ⚡ TIPS TESTING

1. **Test Public vs Protected**: Selalu test kedua-duanya
2. **Test Role-based Access**: Coba dengan berbagai role
3. **Test CRUD Operations**: Create → Read → Update → Delete
4. **Test Error Cases**: Invalid ID, missing fields, wrong role
5. **Test File Upload**: Verifikasi file type dan size
6. **Test Pagination**: page=1, page=2, limit berbeda
7. **Test Filtering**: Gunakan query parameters
8. **Test Status Codes**:
   - 200 OK
   - 201 Created
   - 400 Bad Request
   - 401 Unauthorized
   - 403 Forbidden
   - 404 Not Found
   - 500 Server Error

---

## 🚀 NEXT STEPS

1. **Integration Testing**: Test antar service
2. **Load Testing**: Verifikasi performance dengan load
3. **Security Testing**: SQL injection, XSS, CSRF
4. **Documentation**: Update API docs sesuai findings
5. **Automation**: Setup automated test scripts

