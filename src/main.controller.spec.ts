import { Test, TestingModule } from '@nestjs/testing';
import { MainController } from './main.controller';
import { Response } from 'express';
import { join } from 'path';

describe('MainController', () => {
  let controller: MainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainController],
    }).compile();

    controller = module.get<MainController>(MainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHome', () => {
    it('should serve index.html file', () => {
      const mockResponse = {
        sendFile: jest.fn(),
      } as unknown as Response;

      const expectedPath = join(__dirname, '..', 'public', 'index.html');

      controller.getHome(mockResponse);

      expect(mockResponse.sendFile).toHaveBeenCalledWith(expectedPath);
    });

    it('should call sendFile with correct path structure', () => {
      const mockResponse = {
        sendFile: jest.fn(),
      } as unknown as Response;

      controller.getHome(mockResponse);

      expect(mockResponse.sendFile).toHaveBeenCalledTimes(1);

      const calledPath = (mockResponse.sendFile as jest.Mock).mock.calls[0][0];
      expect(calledPath).toContain('public');
      expect(calledPath).toContain('index.html');
    });
  });
});
