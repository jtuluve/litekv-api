import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { KeyGuard } from './key.guard';

describe('KeyGuard', () => {
  let guard: KeyGuard;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;

  beforeEach(() => {
    guard = new KeyGuard();

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
    it('should return true for valid keys', () => {
      const validKeys = [
        'validKey',
        'user123',
        'data',
        'config',
        'settings',
        'name',
        'value',
      ];

      validKeys.forEach((key) => {
        const mockRequest = { params: { key } };
        const mockHttpArgumentsHost = {
          getRequest: jest.fn().mockReturnValue(mockRequest),
          getResponse: jest.fn(),
          getNext: jest.fn(),
        };

        mockExecutionContext.switchToHttp.mockReturnValue(
          mockHttpArgumentsHost,
        );

        const result = guard.canActivate(mockExecutionContext);

        expect(result).toBe(true);
        expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
        expect(mockHttpArgumentsHost.getRequest).toHaveBeenCalled();

        jest.clearAllMocks();
      });
    });

    it('should throw ForbiddenException when key is undefined', () => {
      const mockRequest = { params: {} };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ForbiddenException('Invalid key'),
      );
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
      expect(mockHttpArgumentsHost.getRequest).toHaveBeenCalled();
    });

    it('should throw ForbiddenException for reserved key "_id"', () => {
      const mockRequest = { params: { key: '_id' } };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ForbiddenException('Invalid key'),
      );
    });

    it('should throw ForbiddenException for reserved key "appid"', () => {
      const mockRequest = { params: { key: 'appid' } };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ForbiddenException('Invalid key'),
      );
    });

    it('should throw ForbiddenException for reserved key "createdAt"', () => {
      const mockRequest = { params: { key: 'createdAt' } };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ForbiddenException('Invalid key'),
      );
    });

    it('should throw ForbiddenException for reserved key "updatedAt"', () => {
      const mockRequest = { params: { key: 'updatedAt' } };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ForbiddenException('Invalid key'),
      );
    });

    it('should throw ForbiddenException for all reserved keys', () => {
      const reservedKeys = ['_id', 'appid', 'createdAt', 'updatedAt'];

      reservedKeys.forEach((key) => {
        const mockRequest = { params: { key } };
        const mockHttpArgumentsHost = {
          getRequest: jest.fn().mockReturnValue(mockRequest),
          getResponse: jest.fn(),
          getNext: jest.fn(),
        };

        mockExecutionContext.switchToHttp.mockReturnValue(
          mockHttpArgumentsHost,
        );

        expect(() => guard.canActivate(mockExecutionContext)).toThrow(
          new ForbiddenException('Invalid key'),
        );

        jest.clearAllMocks();
      });
    });

    it('should throw ForbiddenException when request has no params object', () => {
      const mockRequest = {};
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ForbiddenException('Invalid key'),
      );
    });

    it('should throw ForbiddenException for empty string key', () => {
      const mockRequest = { params: { key: '' } };
      const mockHttpArgumentsHost = {
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      };

      mockExecutionContext.switchToHttp.mockReturnValue(mockHttpArgumentsHost);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ForbiddenException('Invalid key'),
      );
    });

    it('should throw ForbiddenException for non-string keys', () => {
      const nonStringKeys = [null, 123, true, {}, []];

      nonStringKeys.forEach((key) => {
        const mockRequest = { params: { key } };
        const mockHttpArgumentsHost = {
          getRequest: jest.fn().mockReturnValue(mockRequest),
          getResponse: jest.fn(),
          getNext: jest.fn(),
        };

        mockExecutionContext.switchToHttp.mockReturnValue(
          mockHttpArgumentsHost,
        );

        expect(() => guard.canActivate(mockExecutionContext)).toThrow(
          new ForbiddenException('Invalid key'),
        );

        jest.clearAllMocks();
      });
    });
  });
});
