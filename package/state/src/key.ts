import { nanoid } from "nanoid";

type FalsyKey = false | null | undefined;
type TruthyKey = string | number | (TruthyKey | FalsyKey)[] | { [key: string]: TruthyKey | FalsyKey };

type RawKey = TruthyKey | FalsyKey;
type HashedKey = string;

const isTruthyKey = (key: RawKey): key is TruthyKey => {
  return !(key === false || key === null || key === undefined);
};

const _hashKey = (key: RawKey): HashedKey | undefined => {
  if (!isTruthyKey(key)) return undefined;
  if (typeof key === "string") return key;
  if (typeof key === "number") return key.toString();
  if (Array.isArray(key)) return key.map(hashKey).filter(isTruthyKey).join(" ");

  const sanitizedEntry = Object.entries(key)
    .sort(([key1], [key2]) => (key1 < key2 ? -1 : 1))
    .filter(([, value]) => isTruthyKey(value))
    .map(([key, value]) => [key, hashKey(value)] as const);
  return JSON.stringify(Object.fromEntries(sanitizedEntry));
};

const hashKey = (...keys: RawKey[]): HashedKey => {
  return keys.map(_hashKey).filter(isTruthyKey).join(" ");
};

const injectKey = (key?: RawKey | true): RawKey => {
  if (key === true) {
    return nanoid();
  }
  return key;
};

export type { FalsyKey, HashedKey, RawKey, TruthyKey };
export { hashKey, injectKey };
