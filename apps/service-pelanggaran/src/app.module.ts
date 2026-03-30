import { Module } from '@nestjs/common';
import { SuratPanggilanModule } from './modules/surat-panggilan/surat-panggilan.module';

@Module({
    imports: [
        SuratPanggilanModule,
        // Kalau nanti kamu bikin module baru (misal: PelanggaranModule), tambahkan juga di sini
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }