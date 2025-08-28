import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { StoreService } from './store.service';
import { App } from 'src/schemas/app.schema';

describe('StoreService', () => {
  let service: StoreService;
  let mockAppModel: any;

  const mockModel = {
    findOne: jest.fn(),
    updateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: getModelToken(App.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    mockAppModel = module.get(getModelToken(App.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVal', () => {
    it('should get value for existing key', async () => {
      const appId = 'test123';
      const key = 'testKey';
      const expectedValue = 'testValue';

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ [key]: expectedValue }),
      };
      mockModel.findOne.mockReturnValue(mockQuery as any);

      const result = await service.getVal(appId, key);

      expect(mockModel.findOne).toHaveBeenCalledWith({ appid: appId });
      expect(mockQuery.select).toHaveBeenCalledWith(`${key} -_id`);
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(result).toBe(expectedValue);
    });

    it('should return empty string for non-existent key', async () => {
      const appId = 'test123';
      const key = 'nonExistentKey';

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({}),
      };
      mockModel.findOne.mockReturnValue(mockQuery as any);

      const result = await service.getVal(appId, key);

      expect(result).toBe('');
    });

    it('should return empty string when document not found', async () => {
      const appId = 'nonexistent';
      const key = 'testKey';

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      };
      mockModel.findOne.mockReturnValue(mockQuery as any);

      const result = await service.getVal(appId, key);

      expect(result).toBe('');
    });
  });

  describe('setVal', () => {
    it('should set value and return true when modified', async () => {
      const appId = 'test123';
      const key = 'testKey';
      const value = 'testValue';

      const mockQuery = {
        lean: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      };
      mockModel.updateOne.mockReturnValue(mockQuery as any);

      const result = await service.setVal(appId, key, value);

      expect(mockModel.updateOne).toHaveBeenCalledWith(
        { appid: appId },
        { [key]: value },
      );
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should set empty string when value is undefined', async () => {
      const appId = 'test123';
      const key = 'testKey';

      const mockQuery = {
        lean: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      };
      mockModel.updateOne.mockReturnValue(mockQuery as any);

      const result = await service.setVal(appId, key, undefined);

      expect(mockModel.updateOne).toHaveBeenCalledWith(
        { appid: appId },
        { [key]: '' },
      );
      expect(result).toBe(true);
    });

    it('should return false when no documents modified', async () => {
      const appId = 'nonexistent';
      const key = 'testKey';
      const value = 'testValue';

      const mockQuery = {
        lean: jest.fn().mockResolvedValue({ modifiedCount: 0 }),
      };
      mockModel.updateOne.mockReturnValue(mockQuery as any);

      const result = await service.setVal(appId, key, value);

      expect(result).toBe(false);
    });
  });

  describe('incVal', () => {
    it('should increment numeric value', async () => {
      const appId = 'test123';
      const key = 'counter';
      const currentValue = 5;

      const mockFindQuery = {
        lean: jest.fn().mockResolvedValue({ [key]: currentValue }),
      };
      const mockUpdateQuery = {
        lean: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      };

      mockModel.findOne.mockReturnValue(mockFindQuery as any);
      mockModel.updateOne.mockReturnValue(mockUpdateQuery as any);

      const result = await service.incVal(appId, key);

      expect(mockModel.findOne).toHaveBeenCalledWith({ appid: appId });
      expect(mockModel.updateOne).toHaveBeenCalledWith(
        { appid: appId },
        { $set: { [key]: currentValue + 1 } },
      );
      expect(result).toBe(true);
    });

    it('should increment from 0 when key does not exist', async () => {
      const appId = 'test123';
      const key = 'newCounter';

      const mockFindQuery = {
        lean: jest.fn().mockResolvedValue({}),
      };
      const mockUpdateQuery = {
        lean: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      };

      mockModel.findOne.mockReturnValue(mockFindQuery as any);
      mockModel.updateOne.mockReturnValue(mockUpdateQuery as any);

      const result = await service.incVal(appId, key);

      expect(mockModel.updateOne).toHaveBeenCalledWith(
        { appid: appId },
        { $set: { [key]: 1 } },
      );
      expect(result).toBe(true);
    });
  });

  describe('decVal', () => {
    it('should decrement numeric value', async () => {
      const appId = 'test123';
      const key = 'counter';
      const currentValue = 5;

      const mockFindQuery = {
        lean: jest.fn().mockResolvedValue({ [key]: currentValue }),
      };
      const mockUpdateQuery = {
        lean: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      };

      mockModel.findOne.mockReturnValue(mockFindQuery as any);
      mockModel.updateOne.mockReturnValue(mockUpdateQuery as any);

      const result = await service.decVal(appId, key);

      expect(mockModel.findOne).toHaveBeenCalledWith({ appid: appId });
      expect(mockModel.updateOne).toHaveBeenCalledWith(
        { appid: appId },
        { $set: { [key]: currentValue - 1 } },
      );
      expect(result).toBe(true);
    });

    it('should decrement from 0 when key does not exist', async () => {
      const appId = 'test123';
      const key = 'newCounter';

      const mockFindQuery = {
        lean: jest.fn().mockResolvedValue({}),
      };
      const mockUpdateQuery = {
        lean: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      };

      mockModel.findOne.mockReturnValue(mockFindQuery as any);
      mockModel.updateOne.mockReturnValue(mockUpdateQuery as any);

      const result = await service.decVal(appId, key);

      expect(mockModel.updateOne).toHaveBeenCalledWith(
        { appid: appId },
        { $set: { [key]: -1 } },
      );
      expect(result).toBe(true);
    });
  });
});
