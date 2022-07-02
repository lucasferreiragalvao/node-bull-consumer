import Redis from 'ioredis';
import config from '../configs';

export default class RedisCli {
  private static instance: RedisCli;

  public static getInstance(): RedisCli {
    if (!RedisCli.instance) {
      RedisCli.instance = new RedisCli();
    }
    return RedisCli.instance;
  }

  private redis: Redis;

  private constructor() {
    this.redis = new Redis(config.redis);
  }

  async getJSON(key: string) {
    const redisKey = await this.redis.get(key);
    if (redisKey) {
      return JSON.parse(redisKey);
    }
    return undefined;
  }

  async setJSON(key: string, value: any) {
    await this.redis.set(key, JSON.stringify(value));
  }
}
