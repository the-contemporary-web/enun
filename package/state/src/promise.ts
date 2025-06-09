const isPromiseLike = <Value>(value: Value | PromiseLike<Value>): value is PromiseLike<Value> => {
  return typeof value === "object" && value !== null && "then" in value;
};

export { isPromiseLike };
