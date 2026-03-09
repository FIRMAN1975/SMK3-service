import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceProfileService {
  getHello(): string {
    return 'Hello World!';
  }
}
