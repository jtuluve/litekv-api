import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MainModule } from '../src/main.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('Lite KV API (e2e)', () => {
  let app: INestApplication;
  let testAppId: string;
  let mongoConnection: Connection;

  beforeAll(async () => {
    // Set test environment variable for database
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

    const moduleRef = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // Get database connection for cleanup
    mongoConnection = moduleRef.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    // Clean up test database
    if (mongoConnection) {
      await mongoConnection.db?.dropDatabase();
      await mongoConnection.close();
    }
    await app.close();
  });

  describe('/api/createApp (GET)', () => {
    it('should create a new app and return app ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/createApp')
        .expect(200);

      expect(response.text).toBeTruthy();
      expect(typeof response.text).toBe('string');
      testAppId = response.text; // Store for subsequent tests
    });
  });

  describe('/api/exists/:appid (GET)', () => {
    it('should return true for existing app', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/exists/${testAppId}`)
        .expect(200);

      expect(JSON.parse(response.text)).toBe(true);
    });

    it('should return false for non-existing app', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/exists/non-existent-app-id')
        .expect(200);

      expect(JSON.parse(response.text)).toBe(false);
    });
  });

  describe('/api/setVal/:appid/:key/:value (GET)', () => {
    it('should set a key-value pair', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/setVal/${testAppId}/testKey/testValue`)
        .expect(200);

      expect(JSON.parse(response.text)).toBe(true);
    });

    it('should set a key without value (empty string)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/setVal/${testAppId}/emptyKey`)
        .expect(200);

      expect(JSON.parse(response.text)).toBe(true);
    });

    it('should fail for non-existent app', async () => {
      await request(app.getHttpServer())
        .get('/api/setVal/non-existent-app/key/value')
        .expect(404); // AppGuard returns 404
    });
  });

  describe('/api/getVal/:appid/:key (GET)', () => {
    it('should get an existing key-value pair', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/getVal/${testAppId}/testKey`)
        .expect(200);

      expect(response.text).toBe('testValue');
    });

    it('should return empty string for non-existent key', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/getVal/${testAppId}/nonExistentKey`)
        .expect(200);

      expect(response.text).toBe('');
    });

    it('should return empty string for empty key', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/getVal/${testAppId}/emptyKey`)
        .expect(200);

      expect(response.text).toBe('');
    });

    it('should fail for non-existent app', async () => {
      await request(app.getHttpServer())
        .get('/api/getVal/non-existent-app/key')
        .expect(404); // AppGuard returns 404
    });
  });

  describe('/api/inc/:appid/:key (GET)', () => {
    beforeEach(async () => {
      // Set initial numeric value
      await request(app.getHttpServer()).get(
        `/api/setVal/${testAppId}/numKey/5`,
      );
    });

    it('should increment a numeric value', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/inc/${testAppId}/numKey`)
        .expect(200);

      expect(JSON.parse(response.text)).toBe(true);

      // Verify the value was incremented
      const getResponse = await request(app.getHttpServer()).get(
        `/api/getVal/${testAppId}/numKey`,
      );

      expect(getResponse.text).toBe('6');
    });

    it('should fail for non-existent app', async () => {
      await request(app.getHttpServer())
        .get('/api/inc/non-existent-app/key')
        .expect(404);
    });
  });

  describe('/api/dec/:appid/:key (GET)', () => {
    beforeEach(async () => {
      // Set initial numeric value
      await request(app.getHttpServer()).get(
        `/api/setVal/${testAppId}/decKey/10`,
      );
    });

    it('should decrement a numeric value', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/dec/${testAppId}/decKey`)
        .expect(200);

      expect(JSON.parse(response.text)).toBe(true);

      // Verify the value was decremented
      const getResponse = await request(app.getHttpServer()).get(
        `/api/getVal/${testAppId}/decKey`,
      );

      expect(getResponse.text).toBe('9');
    });

    it('should fail for non-existent app', async () => {
      await request(app.getHttpServer())
        .get('/api/dec/non-existent-app/key')
        .expect(404);
    });
  });

  describe('/ (GET)', () => {
    it('should serve the home page', async () => {
      await request(app.getHttpServer()).get('/').expect(200);
    });
  });
});
