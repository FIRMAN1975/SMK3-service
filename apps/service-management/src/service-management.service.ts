import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceManagementService {
  getHello(): string {
    return 'Hello World!';
  }
}
