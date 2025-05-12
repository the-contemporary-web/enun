const _log = (message: string) => {
  console.log("[LocalStorageRepository]", message);
};

const _delay = (ms?: number) => {
  const delayedMs = ms ?? Math.random() * 500;
  return new Promise(resolve => setTimeout(resolve, delayedMs));
};

const get = async <T>(key: string, defaultValue: T) => {
  await _delay();
  const value = localStorage.getItem(key);
  await _delay();
  _log(`GET ${key} ${value ? "success" : "failed"}`);
  return value ? (JSON.parse(value) as T) : defaultValue;
};

const set = async (key: string, value: unknown) => {
  await _delay();
  localStorage.setItem(key, JSON.stringify(value));
  await _delay();
  _log(`SET ${key} ${value ? "success" : "failed"}`);
  return true;
};

const LocalStorageRepository = {
  get,
  set,
};

export { LocalStorageRepository };
