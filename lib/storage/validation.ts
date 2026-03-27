export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isArrayOf<T>(value: unknown, predicate: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every((item) => predicate(item));
}

export function isStringArray(value: unknown): value is string[] {
  return isArrayOf(value, isString);
}

export function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || isString(value);
}

export function isOptionalBoolean(value: unknown): value is boolean | undefined {
  return value === undefined || isBoolean(value);
}

export function isOptionalNumber(value: unknown): value is number | undefined {
  return value === undefined || isNumber(value);
}

export function isOptionalStringArray(value: unknown): value is string[] | undefined {
  return value === undefined || isStringArray(value);
}

export function isOptionalRecordOfStrings(value: unknown): value is Record<string, string> | undefined {
  return value === undefined || (isRecord(value) && Object.values(value).every((item) => isString(item)));
}

export function isOptionalRecordOfNumbers(value: unknown): value is Record<string, number> | undefined {
  return value === undefined || (isRecord(value) && Object.values(value).every((item) => isNumber(item)));
}
