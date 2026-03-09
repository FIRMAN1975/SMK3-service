import { Test, TestingModule } from '@nestjs/testing';
import { ServicePelanggaranController } from './service-pelanggaran.controller';
import { ServicePelanggaranService } from './service-pelanggaran.service';

describe('ServicePelanggaranController', () => {
  let servicePelanggaranController: ServicePelanggaranController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServicePelanggaranController],
      providers: [ServicePelanggaranService],
    }).compile();

    servicePelanggaranController = app.get<ServicePelanggaranController>(ServicePelanggaranController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(servicePelanggaranController.getHello()).toBe('Hello World!');
    });
  });
});
