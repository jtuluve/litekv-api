import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

type MockAppService = {
  createApp: jest.MockedFunction<() => Promise<{ appid: string; _id: string }>>;
  exists: jest.MockedFunction<
    (appId: string) => Promise<{ appid?: string; _id: string } | null>
  >;
};

describe('AppController', () => {
  let controller: AppController;
  let mockAppService: MockAppService;

  beforeEach(async () => {
    const mockAppServiceImpl: MockAppService = {
      createApp: jest.fn(),
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppServiceImpl,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    mockAppService = module.get<MockAppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createApp', () => {
    it('should create an app and return its ID', async () => {
      const mockApp = { appid: 'test123456', _id: 'mongoId' };
      mockAppService.createApp.mockResolvedValue(mockApp);

      const result = await controller.createApp();

      expect(mockAppService.createApp).toHaveBeenCalled();
      expect(result).toBe(mockApp.appid);
    });
  });

  describe('exists', () => {
    it('should return true if app exists', async () => {
      const appId = 'test123';
      const mockApp = { appid: appId, _id: 'mongoId' };
      mockAppService.exists.mockResolvedValue(mockApp);

      const result = await controller.exists(appId);

      expect(mockAppService.exists).toHaveBeenCalledWith(appId);
      expect(result).toBe(true);
    });

    it('should return false if app does not exist', async () => {
      const appId = 'nonexistent';
      mockAppService.exists.mockResolvedValue(null);

      const result = await controller.exists(appId);

      expect(mockAppService.exists).toHaveBeenCalledWith(appId);
      expect(result).toBe(false);
    });
  });
});
