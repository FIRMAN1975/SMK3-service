import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicePortofolioService {
  getHello(): string {
    return 'Hello World!';
  }
}
