import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { GatewayInternalGuard } from '@app/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SejarahIdentitasModule } from './modules/sejarah-identitas/sejarah-identitas.module';
import { VisiMisiModule } from './modules/visi-misi/visi-misi.module';
import { StrukturOrganisasiModule } from './modules/struktur-organisasi/struktur-organisasi.module';
import { FasilitasModule } from './modules/fasilitas/fasilitas.module';
import { PrestasiModule } from './modules/prestasi/prestasi.module';
import { ProgramKeahlianModule } from './modules/program-keahlian/program-keahlian.module';
import { MitraKerjasamaModule } from './modules/mitra-kerjasama/mitra-kerjasama.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SejarahIdentitasModule,
    VisiMisiModule,
    StrukturOrganisasiModule,
    FasilitasModule,
    PrestasiModule,
    ProgramKeahlianModule,
    MitraKerjasamaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: GatewayInternalGuard },
  ],
})
export class AppModule { }
