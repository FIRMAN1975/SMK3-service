import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewayInternalGuard } from '@app/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { resolveManagementDatabaseUrl } from './config/database.config';
import { GuruEntity } from './entities/guru.entity';
import { SiswaEntity } from './entities/siswa.entity';
import { PortofolioEntity } from './entities/portofolio.entity';
import { GuruModule } from './modules/guru/guru.module';
import { RabbitmqModule } from './modules/rabbitmq/rabbitmq.module';
import { SiswaModule } from './modules/siswa/siswa.module';
import { PortofolioModule } from './modules/portofolio/portofolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV');
        const forceSync = configService.get<string>('TYPEORM_SYNC') === 'true';

        return {
          type: 'postgres',
          url: resolveManagementDatabaseUrl(configService),
          entities: [GuruEntity, SiswaEntity, PortofolioEntity],
          synchronize: forceSync || nodeEnv !== 'production',
          logging: nodeEnv !== 'production',
          autoLoadEntities: true,
        };
      },
    }),
    RabbitmqModule,
    GuruModule,
    SiswaModule,
    // Portofolio module (management-owned portfolio/documents)
    PortofolioModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: GatewayInternalGuard }],
})
export class AppModule {}