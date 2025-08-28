import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { IdService } from './id.service';
import { App } from 'src/schemas/app.schema';

describe('AppService', () => {
  let service: AppService;
  let mockAppModel: any;
  let mockIdService: any;

  const mockModel = {
    constructor: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const mockIdServiceImpl = {
      generateId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getModelToken(App.name),
          useValue: mockModel,
        },
        {
          provide: IdService,
          useValue: mockIdServiceImpl,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    mockAppModel = module.get(getModelToken(App.name));
    mockIdService = module.get(IdService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createApp', () => {
    it('should create a new app with generated ID', async () => {
      const generatedId = 'test123456';
      const mockSavedApp = { appid: generatedId, _id: 'mongoId' };

      mockIdService.generateId.mockResolvedValue(generatedId);

      // Mock the constructor and save method
      const mockAppInstance = {
        save: jest.fn().mockResolvedValue(mockSavedApp),
      };
      (mockModel.constructor as any) = jest
        .fn()
        .mockReturnValue(mockAppInstance);
      // Mock the new AppModel() call by overriding the constructor behavior
      (service as any).AppModel = jest.fn().mockReturnValue(mockAppInstance);

      const result = await service.createApp();

      expect(mockIdService.generateId).toHaveBeenCalled();
      expect(mockAppInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockSavedApp);
    });
  });

  describe('exists', () => {
    it('should find an existing app by ID', async () => {
      const appId = 'test123';
      const mockApp = { appid: appId, _id: 'mongoId' };

      const mockQuery = {
        lean: jest.fn().mockResolvedValue(mockApp),
      };
      mockModel.findOne.mockReturnValue(mockQuery);

      const result = await service.exists(appId);

      expect(mockModel.findOne).toHaveBeenCalledWith({ appid: appId });
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(result).toEqual(mockApp);
    });

    it('should return null for non-existent app', async () => {
      const appId = 'nonexistent';

      const mockQuery = {
        lean: jest.fn().mockResolvedValue(null),
      };
      mockModel.findOne.mockReturnValue(mockQuery as any);

      const result = await service.exists(appId);

      expect(mockModel.findOne).toHaveBeenCalledWith({ appid: appId });
      expect(result).toBeNull();
    });
  });
});
