import { Test, TestingModule } from '@nestjs/testing';
import { ServiceProfileController } from './service-profile.controller';
import { ServiceProfileService } from './service-profile.service';

describe('ServiceProfileController', () => {
  let serviceProfileController: ServiceProfileController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceProfileController],
      providers: [ServiceProfileService],
    }).compile();

    serviceProfileController = app.get<ServiceProfileController>(ServiceProfileController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serviceProfileController.getHello()).toBe('Hello World!');
    });
  });
});
