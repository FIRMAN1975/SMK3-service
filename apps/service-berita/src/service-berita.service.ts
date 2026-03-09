import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceBeritaService {
  getHello(): string {
    return 'Hello World!';
  }
}
