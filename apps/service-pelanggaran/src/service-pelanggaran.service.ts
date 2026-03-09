import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicePelanggaranService {
  getHello(): string {
    return 'Hello World!';
  }
}
