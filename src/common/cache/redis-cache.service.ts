import * as _ from 'lodash';
import * as redis from 'redis';
import { Logger } from '@nestjs/common';

export class RedisCacheService {
  public db = 0;
  private client: redis.RedisClientType<any>;
  protected logger = new Logger(this.constructor.name);

  constructor(connectionString: string) {
    this.connect(connectionString);
  }

  private connect(connectionString: string) {
    try {
      this.client = redis.createClient({ url: `${connectionString}/${this.db}` });
      this.client.on('connect', () => {
        this.logger.log(`Connected to redis: ${`${connectionString}/${this.db}`}`);
      });

      this.client.connect();
    } catch (e) {
      this.logger.error(`url: ${`${connectionString}/${this.db}`}. ${e.message}`);
    }
  }

  public async getJSON<T>(cacheKey: string): Promise<T> {
    const result = await this.client.get(cacheKey);
    return result ? JSON.parse(result) : null;
  }

  public async listJSON<T>(cacheKeys: string[]): Promise<T[]> {
    const result = await this.client.mGet(_.uniq(cacheKeys));
    return result.length ? result.map((item) => JSON.parse(item)) : [];
  }

  public async setJSON(key: string, value: any, lifetime?: number) {
    return await this.client.set(key, JSON.stringify(value), lifetime ? { PX: lifetime } : {});
  }

  public async del(key: string | string[]) {
    return await this.client.del(key);
  }

  public async set(key: string, value: any, lifetime?: number) {
    return await this.client.set(key, value, lifetime ? { PX: lifetime } : {});
  }

  public async get(cacheKey: string) {
    return await this.client.get(cacheKey);
  }

  public async list(cacheKeys: string[]) {
    const result = await this.client.mGet(_.uniq(cacheKeys));
    return result.length ? result.map((item) => item) : [];
  }

  public async flushDb() {
    await this.client.flushDb();
  }
}
