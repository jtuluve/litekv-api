import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { IdService } from './id.service';
import { App } from 'src/schemas/app.schema';

describe('IdService', () => {
  let service: IdService;
  let mockAppModel: any;

  const mockModel = {
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdService,
        {
          provide: getModelToken(App.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<IdService>(IdService);
    mockAppModel = module.get(getModelToken(App.name));

    // Mock the generateRandomId method to return predictable IDs for testing
    jest
      .spyOn(service as any, 'generateRandomId')
      .mockReturnValue('test123456');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateId', () => {
    it('should generate a unique ID successfully', async () => {
      mockAppModel.exists.mockResolvedValue(null); // No collision

      const id = await service.generateId();

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(id).toHaveLength(10);
      expect(mockAppModel.exists).toHaveBeenCalledWith({ appid: id });
    });

    it('should handle ID collisions and retry', async () => {
      mockAppModel.exists
        .mockResolvedValueOnce({ _id: 'some-id' } as any) // First attempt collides
        .mockResolvedValueOnce(null); // Second attempt is unique

      const id = await service.generateId();

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(id).toHaveLength(10);
      expect(mockAppModel.exists).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple collisions before finding unique ID', async () => {
      mockAppModel.exists
        .mockResolvedValueOnce({ _id: 'some-id-1' } as any) // First collision
        .mockResolvedValueOnce({ _id: 'some-id-2' } as any) // Second collision
        .mockResolvedValueOnce({ _id: 'some-id-3' } as any) // Third collision
        .mockResolvedValueOnce(null); // Fourth attempt is unique

      const id = await service.generateId();

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(id).toHaveLength(10);
      expect(mockAppModel.exists).toHaveBeenCalledTimes(4);
    });

    it('should throw error after 5 collision retries', async () => {
      // Mock 6 consecutive collisions (should fail after 5 retries)
      mockAppModel.exists
        .mockResolvedValueOnce({ _id: 'collision-1' } as any)
        .mockResolvedValueOnce({ _id: 'collision-2' } as any)
        .mockResolvedValueOnce({ _id: 'collision-3' } as any)
        .mockResolvedValueOnce({ _id: 'collision-4' } as any)
        .mockResolvedValueOnce({ _id: 'collision-5' } as any)
        .mockResolvedValueOnce({ _id: 'collision-6' } as any);

      await expect(service.generateId()).rejects.toThrow(
        'Failed to generate unique ID after 5 retries',
      );

      expect(mockAppModel.exists).toHaveBeenCalledTimes(6);
    });

    it('should generate multiple IDs successfully', async () => {
      mockAppModel.exists.mockResolvedValue(null);

      const id1 = await service.generateId();
      const id2 = await service.generateId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(mockAppModel.exists).toHaveBeenCalledTimes(2);
    });

    it('should generate IDs with only valid characters', async () => {
      mockAppModel.exists.mockResolvedValue(null);

      const id = await service.generateId();
      const validChars = /^[A-Za-z0-9]+$/;

      expect(id).toMatch(validChars);
    });

    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      mockAppModel.exists.mockRejectedValue(dbError);

      await expect(service.generateId()).rejects.toThrow(dbError);
    });
  });
});
