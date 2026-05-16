# ❌ ERROR: "Request harus melalui API Gateway"

## Penyebab Error

Service-berita (dan beberapa service lain) punya **GatewayGuard** yang memvalidasi setiap request harus:

1. **Punya header `X-Gateway-Secret`** dengan value dari env `INTERNAL_GATEWAY_SECRET`
2. **Punya header `X-User-Id`** (user identifier)
3. **Punya header `X-User-Name`** (username)
4. **Punya header `X-User-Roles`** (user roles)

Jika salah satu tidak ada, throw `403 Forbidden`.

### Kode Guard (apps/service-berita/src/auth/gateway.guard.ts)

```typescript
canActivate(context: ExecutionContext): boolean {
  const request = context.switchToHttp().getRequest();
  const expectedSecret = process.env.INTERNAL_GATEWAY_SECRET;

  // ❌ Error 1: Header X-Gateway-Secret tidak cocok
  if (expectedSecret && request.headers['x-gateway-secret'] !== expectedSecret) {
    throw new ForbiddenException('Request harus melalui API Gateway');
  }

  // ❌ Error 2: Bukan endpoint @Public dan X-User-Id tidak ada
  if (!request.headers['x-user-id']) {
    throw new ForbiddenException('Request harus melalui API Gateway');
  }

  return true;
}
```

---

## ✅ Solusi

### ✅ Option 1: Gunakan API Gateway (RECOMMENDED)

**Gunakan base URL ke Gateway:**
```http
@baseUrl = http://localhost:8000/api
```

**API Gateway akan:**
1. Validate JWT token
2. Extract user info dari token
3. Forward ke service dengan header yang dibutuhkan:
   - `X-Gateway-Secret: <INTERNAL_GATEWAY_SECRET>`
   - `X-User-Id: <dari JWT sub>`
   - `X-User-Name: <dari JWT username>`
   - `X-User-Roles: <dari JWT roles>`

**Contoh:**
```http
@baseUrl = http://localhost:8000/api
@token = eyJhbGciOiJSUzI1NiI...

### ✅ Ini akan berhasil (API Gateway forward dengan header lengkap)
GET {{baseUrl}}/berita
Authorization: Bearer {{token}}
```

**Keuntungan:**
- ✅ Aman (JWT validated)
- ✅ Production-ready
- ✅ User info dari token yang trusted
- ✅ Sesuai production architecture

**Syarat:**
- API Gateway HARUS berjalan di port 8000
- Keycloak HARUS berjalan di port 8080 (untuk JWT validation)

---

### ✅ Option 2: Direct Service Testing (Untuk Dev/Debug)

**Gunakan file `api-direct-service.http`**

Tambahkan header manual:
```http
@baseUrl = http://localhost:3003/api
@gatewaySecret = change_me_gateway_internal_secret

GET {{baseUrl}}/berita
X-Gateway-Secret: {{gatewaySecret}}
X-User-Id: 550e8400-e29b-41d4-a716-446655440000
X-User-Name: admin
X-User-Roles: ADMIN
```

**Keuntungan:**
- ✅ Testing tanpa API Gateway
- ✅ Cocok untuk debugging
- ✅ Lebih cepat (tidak perlu route via gateway)

**Kerugian:**
- ❌ User info di-mock (tidak dari JWT)
- ❌ Tidak production-like
- ❌ Security bypass
- ❌ Hanya untuk development

**Syarat:**
- Service berita HARUS berjalan di port 3003
- Tahu value `INTERNAL_GATEWAY_SECRET` dari `.env`

---

## 🔍 Troubleshooting

### Error 403 - Padahal sudah pakai Gateway?

**Cek:**
```
1. @baseUrl = http://localhost:8000/api ✅
2. API Gateway running: curl http://localhost:8000/api/berita ✅
3. Token valid: gunakan auth.http untuk login ✅
4. Authorization header: "Authorization: Bearer <TOKEN>" ✅
```

**Common issues:**
```
❌ @baseUrl = http://localhost:3003/api  
   → Gunakan port 8000 (gateway), bukan 3003 (service)

❌ Authorization: Bearer {{token}} tapi {{token}} = undefined
   → Copy token dari auth.http response dulu

❌ Keycloak belum login
   → Klik "Send Request" pada POST {{keycloakUrl}}/token di auth.http
```

---

### Error 403 - Saat pakai Direct Service?

**Cek header:**
```
X-Gateway-Secret: change_me_gateway_internal_secret  ✅ Ada?
X-User-Id: 550e8400-...                              ✅ Ada?
X-User-Name: admin                                   ✅ Ada?
X-User-Roles: ADMIN                                  ✅ Ada?
```

**Jika masih error:**
```
1. Cek .env di root folder
   INTERNAL_GATEWAY_SECRET=change_me_gateway_internal_secret
   
2. Update @gatewaySecret di api-direct-service.http dengan value dari .env

3. Test dengan curl:
   curl -H "X-Gateway-Secret: change_me_gateway_internal_secret" \
        -H "X-User-Id: user-123" \
        -H "X-User-Name: admin" \
        -H "X-User-Roles: ADMIN" \
        http://localhost:3003/api/berita
```

---

## 📝 Quick Decision Tree

```
┌─ Apakah ingin test REAL production setup?
│
├─ YES → Gunakan API Gateway (api.http)
│        - Setup .env dengan INTERNAL_GATEWAY_SECRET
│        - Buat/update Keycloak users
│        - Login & dapat token via auth.http
│        - Gunakan token di api.http
│
└─ NO (hanya debugging individual service)
   └─ Gunakan Direct Service (api-direct-service.http)
      - Pastikan service berjalan
      - Set header manual (mock user info)
      - Test endpoint tertentu saja
```

---

## 📋 Checklist Setup

### Setup Option 1: Gateway + Keycloak (RECOMMENDED)

- [ ] Clone repo selesai
- [ ] `.env` ada di root folder
- [ ] Docker containers berjalan:
  - [ ] Keycloak (port 8080)
  - [ ] PostgreSQL (semua database)
  - [ ] RabbitMQ (port 5672)
- [ ] Services running:
  - [ ] API Gateway (port 8000)
  - [ ] service-berita (port 3003)
  - [ ] service-profile (port 3002)
  - [ ] service-portofolio (port 3004)
  - [ ] service-pelanggaran (port 3001)
- [ ] Get token:
  - [ ] Buka auth.http
  - [ ] Klik "Send Request" pada POST token ADMIN
  - [ ] Copy access_token
- [ ] Setup api.http:
  - [ ] @baseUrl = http://localhost:8000/api
  - [ ] @token = <TOKEN_DARI_STEP_SEBELUMNYA>
- [ ] Test request:
  - [ ] Klik "Send Request" di api.http
  - [ ] Response 200 OK ✅

---

### Setup Option 2: Direct Service (DEBUG ONLY)

- [ ] Services running (tanpa gateway)
  - [ ] service-berita (port 3003)
  - atau lainnya
- [ ] Buka api-direct-service.http
- [ ] Update @gatewaySecret dengan value dari .env
- [ ] Update @adminUserId dengan UUID valid
- [ ] Test request dengan header lengkap
- [ ] Response 200 OK ✅

---

## 🎓 Penjelasan Teknis

### Mengapa Ada GatewayGuard?

1. **Security**: Service tidak percaya request langsung, harus via gateway yang sudah authenticated
2. **User Context**: Service tahu siapa yang request (dari X-User-* headers)
3. **Audit Trail**: Gateway log semua request, jadi ada trail
4. **Rate Limiting**: Gateway bisa rate-limit per user
5. **Centralized Auth**: Keycloak hanya di gateway, service tidak perlu keycloak

### Flow Normal (Production):

```
Browser/Mobile
     ↓
    [JWT]
     ↓
API Gateway (port 8000)
     ├─ Validate JWT
     ├─ Extract user info
     └─ Add X-Gateway-Secret + X-User-* headers
        ↓
    Service (port 3001-3004)
     ├─ Check X-Gateway-Secret
     ├─ Check X-User-Id ada
     └─ Process request dengan user context
        ↓
    Response
```

### Flow Direct Service (Dev Only):

```
REST Client (.http file)
     ├─ Add X-Gateway-Secret (mock)
     ├─ Add X-User-Id (mock)
     ├─ Add X-User-Name (mock)
     ├─ Add X-User-Roles (mock)
     ↓
Service (port 3003)
 ├─ Check X-Gateway-Secret ✅
 ├─ Check X-User-Id ada ✅
 └─ Process request
    ↓
Response
```

---

## 🚀 Recommended Workflow

### For Production Testing:
```
1. Use api.http dengan API Gateway
2. Auth via Keycloak (auth.http)
3. Real JWT tokens
4. Paling mirip dengan production
```

### For Development/Debugging:
```
1. Use api-direct-service.http untuk single service
2. Mock headers dengan X-Gateway-Secret & X-User-*
3. Lebih cepat tanpa gateway overhead
4. Jika semua service OK → test via gateway
```

---

**Summary:** ✅ Gunakan **api.http + Gateway** untuk testing normal. Gunakan **api-direct-service.http** hanya saat perlu debug individual service.
