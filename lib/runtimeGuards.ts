export function parseSafeDate(value?: string | null): Date | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return null;
  }

  const parsedDate = new Date(trimmedValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function getSafeTimestamp(value?: string | null, fallback = 0): number {
  return parseSafeDate(value)?.getTime() ?? fallback;
}

export function getSafeExternalHref(value?: string | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return null;
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
      ? parsedUrl.toString()
      : null;
  } catch {
    return null;
  }
}
