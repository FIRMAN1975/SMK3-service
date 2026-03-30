import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { dbPelanggaran } from './config/database'; // Sesuaikan path-nya jika perlu

async function bootstrap() {
    console.log("⏳ 1. Memulai NestJS...");
    const app = await NestFactory.create(AppModule);

    console.log("⏳ 2. Mengecek Koneksi Database...");
    try {
        await dbPelanggaran.authenticate();
        console.log("✅ Database Terhubung!");
    } catch (err) {
        console.error("❌ Gagal Konek Database:", err.message);
    }

    app.setGlobalPrefix('api');

    app.setGlobalPrefix('api');

    // 🔥 UBAH BAGIAN INI MENJADI EKSPLISIT 🔥
    app.enableCors({
        origin: '*', // Izinkan semua aplikasi Frontend untuk nembak API ini
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const port = process.env.PORT || 3001;
    console.log("⏳ 3. Menyalakan Server...");
    await app.listen(port);

    console.log(`🚀 Service Pelanggaran menyala di: http://localhost:${port}/api`);
}
bootstrap();