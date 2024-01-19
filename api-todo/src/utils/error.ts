export function toError(value: unknown): Error | null {
  if (value) {
    if (value instanceof Error) {
      return value;
    } else {
      return new Error(String(value));
    }
  } else {
    return null;
  }
}
