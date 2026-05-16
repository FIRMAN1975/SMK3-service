# Daftar Endpoint Gateway Monorepo Sekolah

Base URL gateway untuk Postman:

```txt
http://localhost:3000
```

Gunakan gateway sebagai satu pintu. Jangan test langsung ke port service kecuali untuk debugging internal.

## API Gateway

```txt
GET  /health       [PUBLIC]
GET  /auth/me      [JWT]
```

## Service Berita

Semua endpoint berikut lewat gateway dan diteruskan ke `service-berita`.

### Berita

```txt
GET     /api/berita                 [PUBLIC] page, limit
GET     /api/berita/:id             [PUBLIC]
POST    /api/berita                 [ADMIN]
PUT     /api/berita/:id             [ADMIN, GURU]
DELETE  /api/berita/:id             [ADMIN]
```

### Categories

```txt
GET     /api/categories             [PUBLIC]
GET     /api/categories/:id         [PUBLIC]
POST    /api/categories             [ADMIN]
PUT     /api/categories/:id         [ADMIN]
PUT     /api/categories/:id/toggle-active [ADMIN]
DELETE  /api/categories/:id         [ADMIN]
```

### Pengumuman

```txt
GET     /api/pengumuman             [PUBLIC] page, limit
GET     /api/pengumuman/:id         [PUBLIC]
POST    /api/pengumuman             [ADMIN]
PUT     /api/pengumuman/:id         [ADMIN]
PUT     /api/pengumuman/:id/toggle-active [ADMIN]
DELETE  /api/pengumuman/:id         [ADMIN]
```

### Agenda

```txt
GET     /api/agenda                 [PUBLIC] page, limit, category
GET     /api/agenda/:id             [PUBLIC]
POST    /api/agenda                 [ADMIN]
PUT     /api/agenda/:id             [ADMIN]
PUT     /api/agenda/:id/toggle-active [ADMIN]
DELETE  /api/agenda/:id             [ADMIN]
```

### Search

```txt
GET     /api/search                 [PUBLIC] q, limit
```

## Service Profile

Semua endpoint berikut lewat gateway dan diteruskan ke `service-profile`. Di gateway saat ini semua route profile selain uploads butuh JWT dengan role `ADMIN`, `GURU`, atau `SISWA`.

### Root Profile

```txt
GET     /api/profile                [JWT: ADMIN, GURU, SISWA]
```

### Sejarah Identitas

```txt
GET     /api/profile/sejarah-identitas      [JWT: ADMIN, GURU, SISWA]
GET     /api/profile/sejarah-identitas/:id  [JWT: ADMIN, GURU, SISWA]
POST    /api/profile/sejarah-identitas      [JWT: ADMIN, GURU, SISWA]
PUT     /api/profile/sejarah-identitas/:id  [JWT: ADMIN, GURU, SISWA]
DELETE  /api/profile/sejarah-identitas/:id  [JWT: ADMIN, GURU, SISWA]
```

### Visi Misi

```txt
GET     /api/profile/visi-misi       [JWT: ADMIN, GURU, SISWA]
GET     /api/profile/visi-misi/:id   [JWT: ADMIN, GURU, SISWA]
POST    /api/profile/visi-misi       [JWT: ADMIN, GURU, SISWA]
PUT     /api/profile/visi-misi/:id   [JWT: ADMIN, GURU, SISWA]
DELETE  /api/profile/visi-misi/:id   [JWT: ADMIN, GURU, SISWA]
```

### Program Keahlian

```txt
GET     /api/profile/program-keahlian      [JWT: ADMIN, GURU, SISWA]
GET     /api/profile/program-keahlian/:id  [JWT: ADMIN, GURU, SISWA]
POST    /api/profile/program-keahlian      [JWT: ADMIN, GURU, SISWA]
PUT     /api/profile/program-keahlian/:id  [JWT: ADMIN, GURU, SISWA]
DELETE  /api/profile/program-keahlian/:id  [JWT: ADMIN, GURU, SISWA]
```

### Prestasi

```txt
GET     /api/profile/prestasi        [JWT: ADMIN, GURU, SISWA]
GET     /api/profile/prestasi/:id    [JWT: ADMIN, GURU, SISWA]
POST    /api/profile/prestasi        [JWT: ADMIN, GURU, SISWA]
PUT     /api/profile/prestasi/:id    [JWT: ADMIN, GURU, SISWA]
DELETE  /api/profile/prestasi/:id    [JWT: ADMIN, GURU, SISWA]
```

### Fasilitas

Untuk `POST` dan `PUT`, gunakan `multipart/form-data`; field file: `foto`.

```txt
GET     /api/profile/fasilitas       [JWT: ADMIN, GURU, SISWA]
GET     /api/profile/fasilitas/:id   [JWT: ADMIN, GURU, SISWA]
POST    /api/profile/fasilitas       [JWT: ADMIN, GURU, SISWA]
PUT     /api/profile/fasilitas/:id   [JWT: ADMIN, GURU, SISWA]
DELETE  /api/profile/fasilitas/:id   [JWT: ADMIN, GURU, SISWA]
```

### Struktur Organisasi

Untuk `POST` dan `PUT`, gunakan `multipart/form-data`; field file wajib: `gambar`.

```txt
GET     /api/profile/struktur-organisasi      [JWT: ADMIN, GURU, SISWA]
GET     /api/profile/struktur-organisasi/:id  [JWT: ADMIN, GURU, SISWA]
POST    /api/profile/struktur-organisasi      [JWT: ADMIN, GURU, SISWA]
PUT     /api/profile/struktur-organisasi/:id  [JWT: ADMIN, GURU, SISWA]
DELETE  /api/profile/struktur-organisasi/:id  [JWT: ADMIN, GURU, SISWA]
```

### Mitra Kerjasama

Untuk `POST` dan `PUT`, gunakan `multipart/form-data`; field file opsional: `logo`.

```txt
GET     /api/profile/mitra-kerjasama      [JWT: ADMIN, GURU, SISWA]
GET     /api/profile/mitra-kerjasama/:id  [JWT: ADMIN, GURU, SISWA]
POST    /api/profile/mitra-kerjasama      [JWT: ADMIN, GURU, SISWA]
PUT     /api/profile/mitra-kerjasama/:id  [JWT: ADMIN, GURU, SISWA]
DELETE  /api/profile/mitra-kerjasama/:id  [JWT: ADMIN, GURU, SISWA]
```

### Uploads Profile

```txt
GET     /api/profile/uploads/*       [PUBLIC]
```

## Service Portofolio

Semua endpoint berikut lewat gateway dan diteruskan ke `service-portofolio`.

```txt
GET     /api/portofolio              [PUBLIC] page, limit, status
GET     /api/portofolio/:id          [PUBLIC]
POST    /api/portofolio              [SISWA]
GET     /api/portofolio/me           [SISWA]
GET     /api/portofolio/review       [ADMIN]
PUT     /api/portofolio/:id          [SISWA]
DELETE  /api/portofolio/:id          [SISWA]
PUT     /api/portofolio/:id/submit   [SISWA]
PUT     /api/portofolio/:id/publish  [ADMIN]
PUT     /api/portofolio/:id/reject   [ADMIN]
```

## Service Pelanggaran

Semua endpoint berikut lewat gateway dan diteruskan ke `service-pelanggaran`.

```txt
GET     /api/pelanggaran             [ADMIN]
GET     /api/pelanggaran/surat-panggilan/master/siswa  [ADMIN]
GET     /api/pelanggaran/surat-panggilan/master/guru   [ADMIN]
GET     /api/pelanggaran/surat-panggilan               [ADMIN]
POST    /api/pelanggaran/surat-panggilan               [ADMIN]
PUT     /api/pelanggaran/surat-panggilan/:id           [ADMIN]
DELETE  /api/pelanggaran/surat-panggilan/:id           [ADMIN]
GET     /api/pelanggaran/surat-panggilan/:id/pdf       [ADMIN]
GET     /api/pelanggaran/surat-panggilan/:id/whatsapp  [ADMIN]
PUT     /api/pelanggaran/surat-panggilan/:id/selesai   [ADMIN]
PUT     /api/pelanggaran/surat-panggilan/:id/batalkan  [ADMIN]
```

Catatan: controller service saat ini tidak punya endpoint `GET /api/surat-panggilan/:id` untuk detail surat biasa. Yang ada adalah `GET /api/surat-panggilan/:id/pdf` dan `GET /api/surat-panggilan/:id/whatsapp`.

## Service Management

Semua endpoint berikut lewat gateway dan diteruskan ke `service-management` Nest.js. Gateway memakai prefix `/api/management`, lalu diteruskan ke service tanpa prefix `/api`.

### Guru

```txt
GET     /api/management/guru             [ADMIN]
GET     /api/management/guru/search      [ADMIN]
GET     /api/management/guru/total       [ADMIN]
GET     /api/management/guru/:id         [ADMIN]
POST    /api/management/guru             [ADMIN]
PUT     /api/management/guru/:id         [ADMIN]
DELETE  /api/management/guru/:id         [ADMIN]
```

### Siswa

```txt
GET     /api/management/siswa                      [ADMIN]
GET     /api/management/siswa/search               [ADMIN]
GET     /api/management/siswa/stats                [ADMIN]
GET     /api/management/siswa/export               [ADMIN]
GET     /api/management/siswa/:id                  [ADMIN]
POST    /api/management/siswa                      [ADMIN]
PUT     /api/management/siswa/:id                  [ADMIN]
DELETE  /api/management/siswa/:id                  [ADMIN]
GET     /api/management/siswa/:id/download/:type   [ADMIN]
POST    /api/management/siswa/:id/upload/:type     [ADMIN]
```

`type` untuk upload/download mengikuti implementasi service management, misalnya file siswa seperti rapor, skl, atau ijazah.

## Header Auth Untuk Postman

Untuk endpoint protected, tambahkan:

```txt
Authorization: Bearer <JWT_TOKEN>
```

Gateway juga meneruskan header berikut ke service internal:

```txt
X-Gateway-Secret
X-User-Id
X-User-Name
X-User-Roles
```

