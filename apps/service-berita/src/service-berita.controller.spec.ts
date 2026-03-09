import { Test, TestingModule } from '@nestjs/testing';
import { ServiceBeritaController } from './service-berita.controller';
import { ServiceBeritaService } from './service-berita.service';

describe('ServiceBeritaController', () => {
  let serviceBeritaController: ServiceBeritaController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceBeritaController],
      providers: [ServiceBeritaService],
    }).compile();

    serviceBeritaController = app.get<ServiceBeritaController>(ServiceBeritaController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serviceBeritaController.getHello()).toBe('Hello World!');
    });
  });
});
