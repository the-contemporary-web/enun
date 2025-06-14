const isPromiseLike = <Value>(value: Value | PromiseLike<Value>): value is PromiseLike<Value> => {
  return typeof value === "object" && value !== null && "then" in value;
};
const isNotPromiseLike = <Value>(value: Value | PromiseLike<Value>): value is Awaited<Value> => {
  return !isPromiseLike(value);
};

export { isNotPromiseLike, isPromiseLike };
