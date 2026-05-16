## ✅ CHECKLIST TESTING SERVICES

Gunakan file ini sebagai panduan testing lengkap untuk semua services.

---

## 📋 PRE-TESTING SETUP

### Infrastructure
- [ ] Keycloak berjalan di port 8080
- [ ] PostgreSQL databases (5 database) terhubung
- [ ] RabbitMQ berjalan di port 5672
- [ ] API Gateway berjalan di port 8000
- [ ] Semua services berjalan (3001, 3002, 3003, 3004)

### REST Client Setup
- [ ] VS Code extension REST Client terinstall
- [ ] File `auth.http` tersedia
- [ ] File `api.http` tersedia
- [ ] File `api-upload.http` tersedia

### Authentication
- [ ] Login ke Keycloak berhasil
- [ ] Dapat access_token untuk ADMIN
- [ ] Dapat access_token untuk SISWA
- [ ] Dapat access_token untuk GURU
- [ ] Token sudah di-copy ke @token di api.http

---

## 🔐 1. AUTHENTICATION TESTING (auth.http)

### Get Token
- [ ] Login ADMIN → 200 OK + access_token
- [ ] Login SISWA → 200 OK + access_token
- [ ] Login GURU → 200 OK + access_token
- [ ] Token tidak expired (iat & exp valid)
- [ ] Refresh token ada dan valid

### Token Validation
- [ ] Introspect token ADMIN → active: true
- [ ] Introspect token SISWA → active: true
- [ ] Introspect token GURU → active: true
- [ ] Decode token → roles terlihat dengan benar

### Logout
- [ ] Logout ADMIN → 204 No Content
- [ ] Token setelah logout tidak valid
- [ ] Refresh token setelah logout → error

---

## 📰 2. SERVICE BERITA - BERITA

### Read (Public)
- [ ] GET /api/berita → 200 OK + array berita
- [ ] GET /api/berita?page=1&limit=5 → pagination works
- [ ] GET /api/berita/1 → 200 OK + detail berita
- [ ] GET /api/berita/999 → 404 Not Found
- [ ] GET /api/berita tanpa token → tetap 200 OK

### Create (ADMIN Only)
- [ ] POST /api/berita dengan token ADMIN → 201 Created
- [ ] POST /api/berita dengan token SISWA → 403 Forbidden
- [ ] POST /api/berita tanpa token → 401 Unauthorized
- [ ] Data berita baru appear di GET list
- [ ] ID auto-generate

### Update (ADMIN & GURU)
- [ ] PUT /api/berita/1 dengan token ADMIN → 200 OK
- [ ] PUT /api/berita/1 dengan token GURU → 200 OK
- [ ] PUT /api/berita/1 dengan token SISWA → 403 Forbidden
- [ ] Perubahan terlihat di GET detail

### Delete (ADMIN Only)
- [ ] DELETE /api/berita/1 dengan token ADMIN → 200 OK / 204
- [ ] DELETE /api/berita/1 dengan token GURU → 403 Forbidden
- [ ] Data sudah tidak ada di GET list

---

## 📁 3. SERVICE BERITA - KATEGORI

### Read (Public)
- [ ] GET /api/categories → 200 OK + array kategori
- [ ] GET /api/categories/1 → 200 OK + detail

### Create (ADMIN)
- [ ] POST /api/categories → 201 Created
- [ ] Response include id, name, slug

### Update (ADMIN)
- [ ] PUT /api/categories/1 → 200 OK
- [ ] Data ter-update

### Toggle Active (ADMIN)
- [ ] PUT /api/categories/1/toggle-active → 200 OK
- [ ] Status is_active berubah

### Delete (ADMIN)
- [ ] DELETE /api/categories/1 → 200 OK / 204

---

## 📢 4. SERVICE BERITA - PENGUMUMAN

### Read (Public)
- [ ] GET /api/pengumuman → 200 OK
- [ ] GET /api/pengumuman?page=1&limit=10 → pagination
- [ ] GET /api/pengumuman/1 → 200 OK + detail

### Create (ADMIN)
- [ ] POST /api/pengumuman → 201 Created

### Update (ADMIN)
- [ ] PUT /api/pengumuman/1 → 200 OK

### Toggle Active (ADMIN)
- [ ] PUT /api/pengumuman/1/toggle-active → 200 OK

### Delete (ADMIN)
- [ ] DELETE /api/pengumuman/1 → 200 OK / 204

---

## 📅 5. SERVICE BERITA - AGENDA

### Read (Public)
- [ ] GET /api/agenda → 200 OK
- [ ] GET /api/agenda?category=academic → filter works
- [ ] GET /api/agenda?page=1&limit=10 → pagination
- [ ] GET /api/agenda/1 → 200 OK + detail

### Create (ADMIN)
- [ ] POST /api/agenda dengan start_date & end_date → 201 Created
- [ ] Dates format valid (ISO 8601)

### Update (ADMIN)
- [ ] PUT /api/agenda/1 → 200 OK

### Toggle Active (ADMIN)
- [ ] PUT /api/agenda/1/toggle-active → 200 OK

### Delete (ADMIN)
- [ ] DELETE /api/agenda/1 → 200 OK / 204

---

## 🔍 6. SERVICE BERITA - SEARCH

### Search Functionality (Public)
- [ ] GET /api/search?q=berita → 200 OK + hasil
- [ ] GET /api/search?q=pengumuman → 200 OK + hasil
- [ ] GET /api/search?q=tech&limit=5 → limit works
- [ ] GET /api/search?q= → returns empty atau error graceful
- [ ] Search case-insensitive

---

## 🏫 7. SERVICE PROFILE - VISI-MISI

### Read (Public)
- [ ] GET /api/profile/visi-misi → 200 OK
- [ ] GET /api/profile/visi-misi/1 → 200 OK

### CRUD (ADMIN)
- [ ] POST /api/profile/visi-misi → 201 Created
- [ ] PUT /api/profile/visi-misi/1 → 200 OK
- [ ] DELETE /api/profile/visi-misi/1 → 200 OK / 204

---

## 🏢 8. SERVICE PROFILE - FASILITAS

### Read (Public)
- [ ] GET /api/profile/fasilitas → 200 OK
- [ ] GET /api/profile/fasilitas/1 → 200 OK + foto URL

### Upload (ADMIN)
- [ ] POST /api/profile/fasilitas dengan file → 201 Created
- [ ] File tersimpan di /uploads
- [ ] Path foto di response
- [ ] File bisa di-access via GET /api/profile/uploads/...

### Update (ADMIN)
- [ ] PUT /api/profile/fasilitas/1 dengan file baru → 200 OK
- [ ] File lama di-replace
- [ ] File baru bisa di-access

### Delete (ADMIN)
- [ ] DELETE /api/profile/fasilitas/1 → 200 OK / 204

### File Validation
- [ ] Upload file .jpg → OK
- [ ] Upload file .png → OK
- [ ] Upload file .webp → OK
- [ ] Upload file .pdf → 400 Bad Request
- [ ] Upload file.exe → 400 Bad Request

---

## 🎯 9. SERVICE PROFILE - PRESTASI

### Read (Public)
- [ ] GET /api/profile/prestasi → 200 OK
- [ ] GET /api/profile/prestasi/1 → 200 OK

### CRUD (ADMIN)
- [ ] POST /api/profile/prestasi → 201 Created
- [ ] PUT /api/profile/prestasi/1 → 200 OK
- [ ] DELETE /api/profile/prestasi/1 → 200 OK / 204

---

## 🎯 10. SERVICE PROFILE - PROGRAM KEAHLIAN

### Read (Public)
- [ ] GET /api/profile/program-keahlian → 200 OK
- [ ] GET /api/profile/program-keahlian/1 → 200 OK

### CRUD (ADMIN)
- [ ] POST /api/profile/program-keahlian → 201 Created
- [ ] PUT /api/profile/program-keahlian/1 → 200 OK
- [ ] DELETE /api/profile/program-keahlian/1 → 200 OK / 204

---

## 📊 11. SERVICE PROFILE - STRUKTUR ORGANISASI

### Read (Public)
- [ ] GET /api/profile/struktur-organisasi → 200 OK
- [ ] GET /api/profile/struktur-organisasi/1 → 200 OK

### CRUD (ADMIN)
- [ ] POST /api/profile/struktur-organisasi → 201 Created
- [ ] PUT /api/profile/struktur-organisasi/1 → 200 OK
- [ ] DELETE /api/profile/struktur-organisasi/1 → 200 OK / 204

---

## 🤝 12. SERVICE PROFILE - MITRA KERJASAMA

### Read (Public)
- [ ] GET /api/profile/mitra-kerjasama → 200 OK
- [ ] GET /api/profile/mitra-kerjasama/1 → 200 OK

### CRUD (ADMIN)
- [ ] POST /api/profile/mitra-kerjasama → 201 Created
- [ ] PUT /api/profile/mitra-kerjasama/1 → 200 OK
- [ ] DELETE /api/profile/mitra-kerjasama/1 → 200 OK / 204

---

## 📜 13. SERVICE PROFILE - SEJARAH IDENTITAS

### Read (Public)
- [ ] GET /api/profile/sejarah-identitas → 200 OK
- [ ] GET /api/profile/sejarah-identitas/1 → 200 OK

### CRUD (ADMIN)
- [ ] POST /api/profile/sejarah-identitas → 201 Created
- [ ] PUT /api/profile/sejarah-identitas/1 → 200 OK
- [ ] DELETE /api/profile/sejarah-identitas/1 → 200 OK / 204

---

## 🎨 14. SERVICE PORTOFOLIO

### Read (Public)
- [ ] GET /api/portofolio → 200 OK + list portfolio
- [ ] GET /api/portofolio/1 → 200 OK + detail

### User Operations (SISWA)
- [ ] GET /api/portofolio/me → 200 OK (SISWA only)
- [ ] POST /api/portofolio → 201 Created (SISWA)
- [ ] PUT /api/portofolio/1 → 200 OK (SISWA)
- [ ] DELETE /api/portofolio/1 → 200 OK / 204 (SISWA)

### Admin Operations (ADMIN)
- [ ] GET /api/portofolio/review → 200 OK (ADMIN)
- [ ] PUT /api/portofolio/1/publish → 200 OK (ADMIN)
- [ ] PUT /api/portofolio/1/reject → 200 OK (ADMIN)

### Workflow
- [ ] POST → status: draft
- [ ] PUT .../submit → status: submitted
- [ ] PUT .../publish → status: published (ADMIN)
- [ ] PUT .../reject → status: rejected (ADMIN)

---

## ⚖️ 15. SERVICE PELANGGARAN - SURAT PANGGILAN

### Master Data (ADMIN)
- [ ] GET /api/pelanggaran/surat-panggilan/master/siswa → 200 OK
- [ ] GET /api/pelanggaran/surat-panggilan/master/guru → 200 OK

### CRUD (ADMIN)
- [ ] GET /api/pelanggaran/surat-panggilan → 200 OK
- [ ] POST /api/pelanggaran/surat-panggilan → 201 Created
- [ ] PUT /api/pelanggaran/surat-panggilan/1 → 200 OK
- [ ] DELETE /api/pelanggaran/surat-panggilan/1 → 200 OK / 204

### PDF Download (ADMIN)
- [ ] GET /api/pelanggaran/surat-panggilan/1/pdf → 200 OK + PDF file
- [ ] PDF bisa di-download

### WhatsApp Integration (ADMIN)
- [ ] GET /api/pelanggaran/surat-panggilan/1/whatsapp → 200 OK + link
- [ ] Link format: https://wa.me/...

### Workflow (ADMIN)
- [ ] PUT /api/pelanggaran/surat-panggilan/1/selesai → 200 OK
- [ ] PUT /api/pelanggaran/surat-panggilan/1/batalkan → 200 OK

---

## 👨‍💼 16. SERVICE MANAGEMENT

### All Endpoints (ADMIN Only)
- [ ] GET /api/management → 200 OK / 403
- [ ] GET /api/management/status → 200 OK / 403
- [ ] SISWA/GURU tidak bisa akses → 403

---

## 🔒 17. SECURITY & ERROR HANDLING

### Authentication
- [ ] Endpoint public accessible tanpa token
- [ ] Endpoint protected reject 401 tanpa token
- [ ] Endpoint protected reject 401 dengan token invalid
- [ ] Token expired → 401 Unauthorized

### Authorization
- [ ] ADMIN endpoint reject SISWA → 403
- [ ] SISWA endpoint reject GURU → 403
- [ ] ADMIN endpoint accept ADMIN → 200/201

### Validation
- [ ] POST dengan missing required field → 400 Bad Request
- [ ] POST dengan invalid type → 400 / 422
- [ ] POST dengan invalid email → 400
- [ ] PUT dengan invalid ID → 404 Not Found

### Error Response Format
- [ ] Error 400 → { statusCode, message, errors[] }
- [ ] Error 401 → { statusCode, message }
- [ ] Error 403 → { statusCode, message }
- [ ] Error 404 → { statusCode, message }
- [ ] Error 500 → { statusCode, message }

---

## 🚀 18. PERFORMANCE & LOAD

### Response Time
- [ ] GET list < 500ms (tanpa data banyak)
- [ ] POST create < 1000ms
- [ ] Search dengan 100 results < 1000ms

### Pagination
- [ ] Page 1 limit 10 → 10 items
- [ ] Page 2 limit 10 → next 10 items
- [ ] Last page → terakhir ada
- [ ] Beyond last page → empty array

### Data Integrity
- [ ] Double create same data → both exist (atau validation)
- [ ] Update data → history preserved (jika ada)
- [ ] Delete data → cascade handling (jika foreign key)

---

## 📝 TESTING REPORT TEMPLATE

```markdown
## TESTING REPORT - [DATE]

### Environment
- API Gateway: http://localhost:8000 ✅
- Keycloak: http://localhost:8080 ✅
- All Services: Running ✅

### Test Results
- Berita: 11/11 PASS ✅
- Profile: 30/35 PASS ⚠️
- Portfolio: 10/10 PASS ✅
- Pelanggaran: 10/10 PASS ✅
- Management: 2/2 PASS ✅

### Issues Found
1. [Issue 1] - Service Profile fasilitas file upload
2. [Issue 2] - Portfolio reject endpoint body format

### Blocked
- [ ] None

### Next Steps
- [ ] Fix 5 issues di Profile
- [ ] Re-test Portfolio
- [ ] Deploy to staging
```

---

## 🎯 TESTING PRIORITY

### Priority 1 (Must Have)
- [x] Authentication works
- [x] Berita CRUD
- [x] Portfolio CRUD
- [x] Pelanggaran CRUD

### Priority 2 (Should Have)
- [ ] Profile modules CRUD
- [ ] File upload works
- [ ] Search works
- [ ] Pagination works

### Priority 3 (Nice to Have)
- [ ] Performance optimization
- [ ] Edge cases handling
- [ ] Load testing
- [ ] Documentation

---

**Total Checklist Items: ~100+**

**Estimated Time: 4-6 hours (detailed testing)**

**Good Luck! 🚀**
