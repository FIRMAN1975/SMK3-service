# Service Management (Nest.js) - Integration Guide

## Ringkasan Perubahan

Service-management telah diintegrasikan ke dalam monorepo sebagai Nest.js backend untuk guru dan siswa.

### Files yang Diubah / Dibuat:

#### 1. **Dockerfile.ktor** (baru)
- Multi-stage build untuk Gradle project
- Stage 1: Build dengan `gradle:8.4-jdk21`
- Stage 2: Run dengan `openjdk:21-slim`
- Output JAR langsung di `/app/app.jar`

#### 2. **apps/service-management/build.gradle.kts** (updated)
- Tambah dependencies RabbitMQ: `com.rabbitmq:amqp-client:5.21.0`
- Tambah Ktor HTTP client untuk async operations

#### 3. **apps/service-management/src/main/resources/application.yaml** (updated)
- Tambah konfigurasi RabbitMQ URL
- Support DATABASE_URL untuk Docker compatibility

#### 4. **apps/service-management/src/main/kotlin/helpers/DatabaseHelper.kt** (updated)
- Fallback ke Docker env vars: `DATABASE_URL`, `DB_HOST`, `DB_PORT`, dll
- Default host: `db_management` (Docker DNS)
- Logging untuk debug koneksi

#### 5. **apps/service-management/src/main/kotlin/service/RabbitMQService.kt** (baru)
- Class `DomainEvent` untuk event contract
- Method `publishEvent(eventType, payload)` publish ke RabbitMQ
- Exchange: `management.events` (topic)
- Routing key: `guru.*` atau `siswa.*`
- Messages: persistent, durable

#### 6. **apps/service-management/src/main/kotlin/service/GuruService.kt** (updated)
- Constructor inject `RabbitMQService`
- Method `post()` publish event: `guru.created`
- Method `put()` publish event: `guru.updated`

#### 7. **apps/service-management/src/main/kotlin/service/SiswaService.kt** (updated)
- Constructor inject `RabbitMQService`
- Method `post()` publish event: `siswa.created`
- Method `put()` publish event: `siswa.updated`

#### 8. **apps/service-management/src/main/kotlin/module/AppModule.kt** (updated)
- Koin DI: register `RabbitMQService`
- GuruService dan SiswaService inject `RabbitMQService`

#### 9. **.env** (updated)
- `APP_HOST`, `APP_PORT`, `DB_*` vars untuk service-management
- `JWT_SECRET` untuk Ktor JWT auth
- `RABBITMQ_*` vars untuk connection

#### 10. **docker-compose.yml** (updated)
- Enabled `db-management` service (PostgreSQL 15)
- Enabled `service-management` service dengan Dockerfile.ktor
- Port mapping: `8001:8001`
- Service-management expose di gateway `/api/management/*`
- Updated API Gateway depends_on & SERVICE_MANAGEMENT_URL env

## Event Contract

### Event Topology
```
Exchange: management.events (type: topic, durable)
├── Routing Key: guru.created
├── Routing Key: guru.updated
├── Routing Key: siswa.created
└── Routing Key: siswa.updated
```

### Event Payload Schema
```json
{
  "eventId": "UUID string",
  "type": "guru.created | guru.updated | siswa.created | siswa.updated",
  "payload": {
    // guru/siswa data fields
  },
  "occurredAt": "ISO8601 timestamp"
}
```

## Database Configuration

| Env Var | Default | Docker | Ktor Fallback |
|---------|---------|--------|---------------|
| `DB_HOST` | localhost | `db_management` | `db_management` |
| `DB_PORT` | 5432 | 5432 | 5432 |
| `DB_NAME` | db_management | db_management | db_management |
| `DB_USER` | postgres | ${POSTGRES_USER} | postgres |
| `DB_PASSWORD` | postgres_pass | ${POSTGRES_PASSWORD} | postgres_pass |

**Prioritas koneksi:**
1. `DATABASE_URL` env var (jika ada)
2. Individual `DB_*` env vars
3. Fallback hardcoded defaults

## RabbitMQ Configuration

| Env Var | Value |
|---------|-------|
| `RABBITMQ_HOST` | `sekolah_rabbitmq` (Docker DNS) |
| `RABBITMQ_PORT` | `5672` |
| `RABBITMQ_USER` | `${RMQ_USER}` dari .env |
| `RABBITMQ_PASS` | `${RMQ_PASS}` dari .env |

## API Gateway Routing

Service-management tersedia via gateway di:
```
POST /api/management/guru
GET  /api/management/guru
PUT  /api/management/guru/{id}
GET  /api/management/siswa
POST /api/management/siswa
PUT  /api/management/siswa/{id}
```

**Access Control:** ADMIN role only

## Langkah Deployment

1. **Build & Start Containers:**
   ```bash
   docker compose up -d --build
   ```

2. **Verifikasi Service:**
   ```bash
   # Check container status
   docker compose ps

   # Check logs
   docker compose logs -f service_management
   docker compose logs -f db_management

   # Health check
   curl http://localhost:8001/

   # Gateway check
   curl http://localhost:8000/health
   ```

3. **Verifikasi RabbitMQ:**
   ```bash
   # Management UI
   http://localhost:15672
   # Login: ${RMQ_USER} / ${RMQ_PASS}
   
   # Check exchange
   # Exchanges tab → management.events should exist (type: topic, durable)
   ```

4. **Test Event Publishing:**
   ```bash
   # Get Keycloak token
   # POST /auth/me to get roles
   
   # Create guru (akan publish guru.created event)
   curl -X POST http://localhost:8000/api/management/guru \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "namaLengkap": "Budi Santoso",
       "nip": "123456789",
       "mataPelajaran": "Matematika"
     }'
   ```

## Catatan Penting

- **Dockerfile.ktor** harus di root monorepo (tidak di subfolder)
- Service-management port dalam container: `8001` (bukan 8000)
- RabbitMQ connection menggunakan Docker internal hostname `sekolah_rabbitmq`
- Database koneksi menggunakan Docker internal hostname `db_management`
- JWT config di Ktor masih HMAC (bukan Keycloak), sesuai kebutuhan internal
- Event publish **tidak blocking** - async/best-effort (gunakan Outbox Pattern untuk critical events)

## Next Step: Event Consumer di service-pelanggaran

Service-pelanggaran akan consume `guru.*` dan `siswa.*` events via RabbitMQ dan sync ke `surat` table. Siapkan:
1. Consumer service di service-pelanggaran (NestJS RabbitMQ module)
2. Queue: `pelanggaran.events.queue` bind ke `management.events` dengan pattern `guru.*` dan `siswa.*`
3. Idempotency: `processed_events` table untuk prevent duplikasi

---
**Created**: April 2026
**Framework**: Ktor + Gradle (Kotlin)
