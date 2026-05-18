import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Siswa } from '../entities/siswa.entity';
import { SiswaService } from '../services/siswa.service';
import { SiswaController } from '../controllers/siswa.controller';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Siswa]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [SiswaService, JwtAuthGuard, RolesGuard],
  controllers: [SiswaController],
  exports: [SiswaService],
})
export class SiswaModule {}
