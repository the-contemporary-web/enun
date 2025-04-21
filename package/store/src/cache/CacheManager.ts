class CacheManager {
  cacheMap: Map<string, unknown>;
  countMap: Map<string, number>;
  willBeCleaned: boolean;

  constructor() {
    this.cacheMap = new Map<string, unknown>();
    this.countMap = new Map<string, number>();
    this.willBeCleaned = false;
  }

  private get<T>({ key }: { key: string }) {
    return this.cacheMap.get(key) as T | undefined;
  }
  private set<T>({ key, value }: { key: string; value: T }) {
    this.cacheMap.set(key, value);
  }
  private remove({ key }: { key: string }) {
    this.cacheMap.delete(key);
    this.countMap.delete(key);
  }
  private addCount({ key }: { key: string }) {
    const prev = this.countMap.get(key) ?? 0;
    this.countMap.set(key, prev + 1);
  }
  private subtractCount({ key }: { key: string }) {
    const prev = this.countMap.get(key) ?? 0;
    this.countMap.set(key, prev - 1);
  }

  public retrieve<T>({ key, init }: { key: string; init?: () => T }) {
    const cached = this.get<T>({ key });
    if (cached) {
      this.addCount({ key });
      return cached;
    }
    if (!init) {
      throw new Error("Init function must be provided if there's no matching cache");
    }
    const newCache = init();
    this.set({ key, value: newCache });
    this.addCount({ key });
    return newCache;
  }
  public release({ key }: { key: string }) {
    this.subtractCount({ key });
    if (!this.willBeCleaned) {
      this.willBeCleaned = true;
      setTimeout(() => {
        this.clean();
        this.willBeCleaned = false;
      }, 0);
    }
  }
  public clean() {
    this.countMap.forEach((count, key) => {
      if (count < 1) {
        this.remove({ key });
      }
    });
  }

  public match<T>({ prefix, fn }: { prefix: string; fn: (value: T) => void }) {
    const value: T[] = [];
    for (const [key, value] of this.cacheMap.entries()) {
      if (key.startsWith(prefix)) {
        fn(value as T);
      }
    }
    return value;
  }
}

const globalCacheManager = new CacheManager();

export { CacheManager, globalCacheManager };
