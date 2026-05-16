# 📝 REST CLIENT TESTING GUIDE

## 🚀 Setup VS Code REST Client

### 1. Install Extension
Buka VS Code → Extensions → Cari `REST Client` by Huachao Mao → Install

```
VS Code ID: humao.rest-client
```

### 2. File Yang Tersedia
- **api.http** - Semua endpoint testing
- **api-upload.http** - File upload testing

---

## 📖 Cara Menggunakan

### Step 1: Buka File
```
File → Open → sekolah-monorepo/api.http
```

### Step 2: Setup Variables
Di bagian atas file `api.http`, ubah:

```http
@baseUrl = http://localhost:8000/api
@token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # GANTI INI
```

### Step 3: Dapatkan Token dari Keycloak

#### Option A: Via Login API
```bash
curl -X POST http://localhost:8080/realms/smk3/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=api-gateway&grant_type=password&username=admin&password=password&client_secret=your-secret"
```

#### Option B: Buka Keycloak Dashboard
1. Buka http://localhost:8080/admin
2. Login dengan user Keycloak
3. Copy access token dari browser DevTools

### Step 4: Paste Token
Ganti `@token` di atas dengan token yang Anda dapatkan

```http
@token = eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJrZXkxIn0...
```

### Step 5: Test Request
Klik **Send Request** di atas endpoint yang ingin ditest:

```http
### ✅ LIST BERITA (PUBLIC)
GET {{baseUrl}}/berita
Content-Type: {{contentType}}
```

---

## ✨ Fitur REST Client

### 1. Send Request
Klik teks `Send Request` di atas setiap endpoint

### 2. Send and Download
Klik `Send and Download` untuk download response (contoh: PDF)

### 3. Multiple Requests
Gunakan `---` untuk separator antar request

```http
### Request 1
GET {{baseUrl}}/berita

---

### Request 2
POST {{baseUrl}}/berita
```

### 4. Variables
Definisikan di atas file:

```http
@baseUrl = http://localhost:8000/api
@token = your-token-here
@userId = 1
@contentType = application/json
```

Gunakan dengan `{{variableName}}`

### 5. Response Preview
Response ditampilkan di panel sebelah kanan dengan format:
- JSON (formatted)
- XML
- HTML
- Plain text

---

## 🔍 Contoh Testing Workflow

### 1. Test PUBLIC Endpoint (Tanpa Token)
```http
### ✅ LIST BERITA (PUBLIC)
GET http://localhost:8000/api/berita
```
**Expected:** 200 OK + list berita

### 2. Test PROTECTED Endpoint (Dengan Token)
```http
### 🔒 CREATE BERITA (ADMIN)
POST http://localhost:8000/api/berita
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Test Berita",
  "content": "Isi test",
  "category_id": 1
}
```
**Expected:** 201 Created + data dengan ID

### 3. Test UPDATE
```http
### 🔒 EDIT BERITA
PUT http://localhost:8000/api/berita/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Title Updated"
}
```
**Expected:** 200 OK + data updated

### 4. Test DELETE
```http
### 🔒 HAPUS BERITA
DELETE http://localhost:8000/api/berita/1
Authorization: Bearer {{token}}
```
**Expected:** 200 OK / 204 No Content

### 5. Test ERROR (401 Unauthorized)
```http
### ❌ TEST 401 - UNAUTHORIZED
GET http://localhost:8000/api/berita
```
**Expected:** 401 Unauthorized (tanpa token)

### 6. Test SEARCH
```http
### ✅ SEARCH
GET http://localhost:8000/api/search?q=sekolah&limit=10
```
**Expected:** 200 OK + hasil search

---

## 💾 Menyimpan Response

### Automatic Save
REST Client otomatis menyimpan response ke `.rest` folder

### Manual Save
Klik kanan di response → `Save Response Body`

---

## 📊 Response Tab

Response ditampilkan dengan 3 tab:

1. **Response Body** - Hasil response
2. **Response Header** - Header info
3. **Response Size** - Ukuran & timing

---

## 🔧 Advanced Features

### 1. Request Hooks (Setup & Teardown)
Di `.vscode/settings.json`:

```json
{
  "rest-client.previewOption": "body",
  "rest-client.timeoutinmilliseconds": 30000,
  "rest-client.environmentVariables": {
    "$shared": {
      "baseUrl": "http://localhost:8000/api"
    }
  }
}
```

### 2. Environment Variables
Buat file `.env.rest`:

```
@baseUrl = http://localhost:8000/api
@token = your-token
@adminToken = admin-token
```

### 3. Authentication
Berbagai method:

```http
# Bearer Token
Authorization: Bearer {{token}}

# Basic Auth
Authorization: Basic dXNlcjpwYXNz

# API Key
X-API-Key: {{apiKey}}

# Custom Header
X-Custom-Header: value
```

### 4. Query Parameters
```http
GET {{baseUrl}}/berita?page=1&limit=10&category=tech
```

### 5. Form Data
```http
POST {{baseUrl}}/login
Content-Type: application/x-www-form-urlencoded

username=admin&password=123456
```

### 6. Multipart Form
```http
POST {{baseUrl}}/profile/fasilitas
Authorization: Bearer {{token}}

[Form Data]
nama: Lab Komputer
foto: @./image.jpg
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'rest-client'"
**Solusi:** Install extension REST Client di VS Code

### Error: "Authorization header not sent"
**Solusi:** Pastikan token sudah di-setup:
```http
@token = eyJhbGciOi...
Authorization: Bearer {{token}}
```

### Error: "Connection refused"
**Solusi:** Pastikan API Gateway berjalan di port 8000:
```bash
curl http://localhost:8000/api/berita
```

### Response 401 Unauthorized
**Solusi:** Token expired atau salah. Update token baru dari Keycloak

### Response 403 Forbidden
**Solusi:** Role tidak sesuai. Login dengan user ADMIN jika endpoint ADMIN-only

### Response 404 Not Found
**Solusi:** Resource tidak ada. Cek ID atau endpoint

---

## 📝 Contoh .http File Structure

```http
### ==================================================
### VARIABLES
### ==================================================

@baseUrl = http://localhost:8000/api
@token = eyJhbGc...
@contentType = application/json

---

### ==================================================
### GROUP 1: BERITA
### ==================================================

### List Berita
GET {{baseUrl}}/berita

---

### Create Berita
POST {{baseUrl}}/berita
Authorization: Bearer {{token}}
Content-Type: {{contentType}}

{
  "title": "Test",
  "content": "Test content"
}

---

### ==================================================
### GROUP 2: PROFILE
### ==================================================

### List Profile
GET {{baseUrl}}/profile

---
```

---

## 🎯 Best Practices

✅ **DO:**
- Simpan token yang sering digunakan di variable
- Group endpoint berdasarkan service
- Beri comment deskriptif di setiap request
- Test dari yang paling sederhana (GET) dulu
- Gunakan meaningful test data

❌ **DON'T:**
- Jangan hardcode token di file (keamanan)
- Jangan test ke production tanpa izin
- Jangan simpan password di .http file
- Jangan lupa update @baseUrl sesuai environment

---

## 🚀 Quick Start Command

```bash
# 1. Pastikan API Gateway berjalan
npm run start -w apps/api-gateway

# 2. Buka api.http di VS Code
code api.http

# 3. Setup @token variable

# 4. Klik "Send Request" di atas endpoint

# 5. Lihat response di panel sebelah kanan
```

---

## 📚 Referensi Extension

- **Official Docs:** https://marketplace.visualstudio.com/items?itemName=humao.rest-client
- **GitHub:** https://github.com/Huachao/vscode-rest-client
- **VS Code Docs:** https://code.visualstudio.com/docs

---

**Happy Testing! 🎉**
