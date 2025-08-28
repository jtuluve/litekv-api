import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { AppGuard } from 'src/common/guards/app.guard';

describe('StoreController', () => {
  let controller: StoreController;
  let mockStoreService: any;
  beforeEach(async () => {
    const mockStoreServiceImpl = {
      getVal: jest.fn(),
      setVal: jest.fn(),
      incVal: jest.fn(),
      decVal: jest.fn(),
    };

    const mockAppGuardImpl = {
      canActivate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        {
          provide: StoreService,
          useValue: mockStoreServiceImpl,
        },
        {
          provide: AppGuard,
          useValue: mockAppGuardImpl,
        },
      ],
    })
      .overrideGuard(AppGuard)
      .useValue(mockAppGuardImpl)
      .compile();

    controller = module.get<StoreController>(StoreController);
    mockStoreService = module.get(StoreService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getVal', () => {
    it('should get value from store service', async () => {
      const appId = 'test123';
      const key = 'testKey';
      const expectedValue = 'testValue';

      mockStoreService.getVal.mockResolvedValue(expectedValue);

      const result = await controller.getVal(appId, key);

      expect(mockStoreService.getVal).toHaveBeenCalledWith(appId, key);
      expect(result).toBe(expectedValue);
    });

    it('should return empty string when value is undefined', async () => {
      const appId = 'test123';
      const key = 'testKey';

      mockStoreService.getVal.mockResolvedValue(undefined as any);

      const result = await controller.getVal(appId, key);

      expect(mockStoreService.getVal).toHaveBeenCalledWith(appId, key);
      expect(result).toBe('');
    });
  });

  describe('setVal', () => {
    it('should set value through store service', async () => {
      const appId = 'test123';
      const key = 'testKey';
      const value = 'testValue';

      mockStoreService.setVal.mockResolvedValue(true);

      const result = await controller.setVal(appId, key, value);

      expect(mockStoreService.setVal).toHaveBeenCalledWith(appId, key, value);
      expect(result).toBe(true);
    });

    it('should handle setting value that returns false', async () => {
      const appId = 'nonexistent';
      const key = 'testKey';
      const value = 'testValue';

      mockStoreService.setVal.mockResolvedValue(false);

      const result = await controller.setVal(appId, key, value);

      expect(mockStoreService.setVal).toHaveBeenCalledWith(appId, key, value);
      expect(result).toBe(false);
    });
  });

  describe('incVal', () => {
    it('should increment value through store service', async () => {
      const appId = 'test123';
      const key = 'counter';

      mockStoreService.incVal.mockResolvedValue(true);

      const result = await controller.incVal(appId, key);

      expect(mockStoreService.incVal).toHaveBeenCalledWith(appId, key);
      expect(result).toBe(true);
    });

    it('should handle increment that returns false', async () => {
      const appId = 'nonexistent';
      const key = 'counter';

      mockStoreService.incVal.mockResolvedValue(false);

      const result = await controller.incVal(appId, key);

      expect(mockStoreService.incVal).toHaveBeenCalledWith(appId, key);
      expect(result).toBe(false);
    });
  });

  describe('decVal', () => {
    it('should decrement value through store service', async () => {
      const appId = 'test123';
      const key = 'counter';

      mockStoreService.decVal.mockResolvedValue(true);

      const result = await controller.decVal(appId, key);

      expect(mockStoreService.decVal).toHaveBeenCalledWith(appId, key);
      expect(result).toBe(true);
    });

    it('should handle decrement that returns false', async () => {
      const appId = 'nonexistent';
      const key = 'counter';

      mockStoreService.decVal.mockResolvedValue(false);

      const result = await controller.decVal(appId, key);

      expect(mockStoreService.decVal).toHaveBeenCalledWith(appId, key);
      expect(result).toBe(false);
    });
  });
});
