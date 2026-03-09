import { Test, TestingModule } from '@nestjs/testing';
import { ServicePortofolioController } from './service-portofolio.controller';
import { ServicePortofolioService } from './service-portofolio.service';

describe('ServicePortofolioController', () => {
  let servicePortofolioController: ServicePortofolioController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServicePortofolioController],
      providers: [ServicePortofolioService],
    }).compile();

    servicePortofolioController = app.get<ServicePortofolioController>(ServicePortofolioController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(servicePortofolioController.getHello()).toBe('Hello World!');
    });
  });
});
