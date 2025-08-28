import { randomUUID } from 'crypto';
import { App, AppSchema } from './app.schema';

describe('App Schema', () => {
  it('should create the schema successfully', () => {
    expect(AppSchema).toBeDefined();
    expect(AppSchema.paths.appid).toBeDefined();
  });

  it('should have required appid field', () => {
    const appidPath = AppSchema.paths.appid;
    expect(appidPath.isRequired).toBe(true);
  });

  it('should have unique appid field', () => {
    const appidPath = AppSchema.paths.appid;
    expect(appidPath.options.unique).toBe(true);
  });

  it('should have timestamps enabled', () => {
    expect(AppSchema.options.timestamps).toBe(true);
  });

  it('should have strict mode disabled', () => {
    expect(AppSchema.options.strict).toBe(false);
  });

  it('should have correct schema name', () => {
    expect(AppSchema.options.collection).toBeUndefined();
  });

  describe('App class', () => {
    it('should be defined', () => {
      expect(App).toBeDefined();
    });

    it('should have appid property', () => {
      const app = new App();
      expect('appid' in app).toBe(true);
    });
  });

  describe('randomUUID default function', () => {
    it('should generate valid UUID format', () => {
      const uuid = randomUUID();
      expect(uuid).toMatch(
        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/,
      );
    });

    it('should generate different UUIDs on each call', () => {
      const uuid1 = randomUUID();
      const uuid2 = randomUUID();
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate string type', () => {
      const uuid = randomUUID();
      expect(typeof uuid).toBe('string');
    });
  });
});
