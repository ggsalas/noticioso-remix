export function exists<T>(value: T | undefined | null | boolean): value is T {
  return value !== undefined && value !== null;
}
