import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { AppGuard } from './app.guard';
import { App, AppDocument } from 'src/schemas/app.schema';

describe('AppGuard', () => {
  let guard: AppGuard;
  let mockAppModel: jest.Mocked<Model<AppDocument>>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;

  beforeEach(async () => {
    const mockModel = {
      exists: jest.fn(),
      constructor: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppGuard,
        {
          provide: getModelToken(App.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    guard = module.get<AppGuard>(AppGuard);
    mockAppModel = module.get(getModelToken(App.name));

    mockExecutionContext = {
      switchToHttp: jest.fn(),
      getRequest: jest.fn(),
      getResponse: jest.fn(),
      getNext: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when app exists', async () => {
      const appId = 'test-app-123';
      const mockRequest = { params: { appid: appId } };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
      mockAppModel.exists.mockResolvedValue({
        _id: 'mock-mongo-id',
      } as any);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
      expect(mockHttpArgumentsHost.getRequest).toHaveBeenCalled();
      expect(mockAppModel.exists).toHaveBeenCalledWith({ appid: appId });
    });

    it('should throw ForbiddenException when appId is missing', async () => {
      const mockRequest = { params: {} }; // no appid parameter
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new ForbiddenException('App ID is required'),
      );

      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
      expect(mockHttpArgumentsHost.getRequest).toHaveBeenCalled();
      expect(mockAppModel.exists).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when appId is undefined', async () => {
      const mockRequest = { params: { appid: undefined } };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new ForbiddenException('App ID is required'),
      );

      expect(mockAppModel.exists).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when appId is null', async () => {
      const mockRequest = { params: { appid: null } };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new ForbiddenException('App ID is required'),
      );

      expect(mockAppModel.exists).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when appId is empty string', async () => {
      const mockRequest = { params: { appid: '' } };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new ForbiddenException('App ID is required'),
      );

      expect(mockAppModel.exists).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when app does not exist', async () => {
      const appId = 'non-existent-app';
      const mockRequest = { params: { appid: appId } };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
      mockAppModel.exists.mockResolvedValue(null);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new NotFoundException(`App with ID ${appId} not found`),
      );

      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
      expect(mockHttpArgumentsHost.getRequest).toHaveBeenCalled();
      expect(mockAppModel.exists).toHaveBeenCalledWith({ appid: appId });
    });

    it('should handle request without params object', async () => {
      const mockRequest = {}; // no params object at all
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new ForbiddenException('App ID is required'),
      );

      expect(mockAppModel.exists).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      const appId = 'test-app-123';
      const mockRequest = { params: { appid: appId } };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };
      const databaseError = new Error('Database connection failed');

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
      mockAppModel.exists.mockRejectedValue(databaseError);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        databaseError,
      );

      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
      expect(mockHttpArgumentsHost.getRequest).toHaveBeenCalled();
      expect(mockAppModel.exists).toHaveBeenCalledWith({ appid: appId });
    });

    it('should work with various valid app ID formats', async () => {
      const validAppIds = [
        'app-123',
        'test_app_456',
        'MyApp789',
        '12345678-1234-1234-1234-123456789012', // UUID format
        'simple',
      ];

      for (const appId of validAppIds) {
        const mockRequest = { params: { appid: appId } };
        const mockHttpArgumentsHost = {
          getRequest: jest.fn().mockReturnValue(mockRequest),
          getResponse: jest.fn(),
          getNext: jest.fn(),
        };

        mockExecutionContext.switchToHttp.mockReturnValue(
          mockHttpArgumentsHost,
        );
        mockAppModel.exists.mockResolvedValue({
          _id: 'mock-mongo-id',
        } as any);

        const result = await guard.canActivate(mockExecutionContext);

        expect(result).toBe(true);
        expect(mockAppModel.exists).toHaveBeenCalledWith({ appid: appId });

        // Clear mocks for next iteration
        jest.clearAllMocks();
      }
    });

    it('should return true when app exists returns truthy object', async () => {
      const appId = 'existing-app';
      const mockRequest = { params: { appid: appId } };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);
      mockAppModel.exists.mockResolvedValue({
        _id: 'actual-mongo-id',
        appid: appId,
      } as any);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockAppModel.exists).toHaveBeenCalledWith({ appid: appId });
    });
  });
});
