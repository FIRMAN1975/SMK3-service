import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GatewayInternalGuard } from '@app/common';
import { PortofolioModule } from './modules/portofolio/portofolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PortofolioModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: GatewayInternalGuard },
  ],
})
export class AppModule {}
