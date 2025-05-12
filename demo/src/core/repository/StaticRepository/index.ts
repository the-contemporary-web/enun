const ROOT_DIRECTORY_NAME = "/data";

const _log = (message: string) => {
  console.log("[StaticRepository]", message);
};
const _error = (message: unknown) => {
  console.error("[StaticRepository Error]", message);
};

const get = async <T>(url: string, defaultValue: T) => {
  try {
    const response = await fetch(`${ROOT_DIRECTORY_NAME}${url}`);
    const value = (await response.json()) as T;
    _log(`GET ${url} ${value ? "success" : "failed"}`);
    return value ? value : defaultValue;
  } catch (e) {
    _error(e);
    return defaultValue;
  }
};

const StaticRepository = {
  log: _log,
  get,
};

export { StaticRepository };
