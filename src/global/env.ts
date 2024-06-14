export const isDev = process.env.NODE_ENV === 'development';

export const cwd = process.cwd();

export type BaseType = boolean | number | string | undefined | null;

function formatValue<T extends BaseType = string>(
  key: string,
  defaultValue: T,
  callback?: (value: string) => T,
): T {
  const value: string | undefined = process.env[key];
  if (typeof value === 'undefined') return defaultValue;

  if (!callback) return value as unknown as T;

  return callback(value);
}

export const env = (key: string, defaultValue: string = '') =>
  formatValue(key, defaultValue);

export const envString = (key: string, defaultValue: string = '') =>
  formatValue(key, defaultValue);

export const envNumber = (key: string, defaultValue: number = 0) =>
  formatValue(key, defaultValue, (value) => {
    try {
      return Number(value);
    } catch {
      throw new Error(`${key} environment variable is not a number`);
    }
  });

export const envBoolean = (key: string, defaultValue: boolean = false) =>
  formatValue(key, defaultValue, (value) => {
    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(`${key} environment variable is not a boolean`);
    }
  });
