import { RedisCacheService } from './redis-cache.service';

export function RedisCache(cacheConfig: { cacheService: RedisCacheService; lifetime?: number }) {
  return function (_target: object, _propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const keyCache = JSON.stringify(args);
      const resultCache = await cacheConfig.cacheService.getJSON(keyCache);
      if (resultCache) {
        return resultCache;
      }
      const resultService = await original.apply(this, args);
      await cacheConfig.cacheService.setJSON(keyCache, resultService, cacheConfig.lifetime);
      return resultService;
    };

    return descriptor;
  };
}
