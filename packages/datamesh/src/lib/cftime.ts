/**
 * cftime - CF Conventions time parsing for JavaScript
 *
 * Provides time-handling functionality for netCDF files that conform to the
 * Climate and Forecasting (CF) conventions. This is a JavaScript port of the
 * core functionality from Python's cftime library by Unidata.
 *
 * Currently supports Gregorian calendars only:
 * - 'standard' / 'gregorian' (mixed Julian/Gregorian)
 * - 'proleptic_gregorian'
 *
 * @see https://unidata.github.io/cftime/
 * @see http://cfconventions.org/cf-conventions/cf-conventions
 */

/** Supported time units in CF conventions */
export type CFTimeUnit =
  | "days"
  | "hours"
  | "minutes"
  | "seconds"
  | "milliseconds"
  | "microseconds";

/** Supported calendar types (Gregorian only for now) */
export type CFCalendar = "standard" | "gregorian" | "proleptic_gregorian";

/** Parsed CF time units */
export interface ParsedCFUnits {
  /** The time unit (days, hours, etc.) */
  unit: CFTimeUnit;
  /** Reference date as JavaScript Date */
  referenceDate: Date;
  /** Reference date as milliseconds since Unix epoch */
  referenceMs: number;
  /** Original units string */
  original: string;
}

/** Milliseconds per time unit */
const MS_PER_UNIT: Record<CFTimeUnit, number> = {
  microseconds: 0.001,
  milliseconds: 1,
  seconds: 1000,
  minutes: 60 * 1000,
  hours: 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
};

/** Aliases for time units */
const UNIT_ALIASES: Record<string, CFTimeUnit> = {
  day: "days",
  days: "days",
  d: "days",
  hour: "hours",
  hours: "hours",
  hr: "hours",
  hrs: "hours",
  h: "hours",
  minute: "minutes",
  minutes: "minutes",
  min: "minutes",
  mins: "minutes",
  second: "seconds",
  seconds: "seconds",
  sec: "seconds",
  secs: "seconds",
  s: "seconds",
  millisecond: "milliseconds",
  milliseconds: "milliseconds",
  msec: "milliseconds",
  msecs: "milliseconds",
  ms: "milliseconds",
  microsecond: "microseconds",
  microseconds: "microseconds",
  usec: "microseconds",
  usecs: "microseconds",
  us: "microseconds",
};

/** Supported Gregorian calendars */
const GREGORIAN_CALENDARS = new Set([
  "standard",
  "gregorian",
  "proleptic_gregorian",
]);

/**
 * Parse a CF time units string.
 *
 * @param units - CF time units string (e.g., "days since 1970-01-01")
 * @returns Parsed units object
 * @throws Error if units string is invalid
 *
 * @example
 * ```ts
 * const parsed = parseCFUnits("days since 1970-01-01");
 * // { unit: "days", referenceDate: Date, referenceMs: 0, original: "..." }
 *
 * const parsed2 = parseCFUnits("hours since 2000-01-01 00:00:00");
 * // { unit: "hours", referenceDate: Date, referenceMs: 946684800000, original: "..." }
 * ```
 */
export function parseCFUnits(units: string): ParsedCFUnits {
  // Pattern: "<unit> since <reference_time>"
  const pattern = /^\s*(\w+)\s+since\s+(.+?)\s*$/i;
  const match = units.match(pattern);

  if (!match) {
    throw new Error(
      `Invalid CF time units: "${units}". Expected format: "<unit> since <reference_time>"`
    );
  }

  const [, unitStr, refTimeStr] = match;
  const unitLower = unitStr.toLowerCase();

  // Resolve unit alias
  const unit = UNIT_ALIASES[unitLower];
  if (!unit) {
    throw new Error(
      `Unsupported time unit: "${unitStr}". Supported units: days, hours, minutes, seconds, milliseconds, microseconds`
    );
  }

  // Parse reference time
  const referenceDate = parseReferenceTime(refTimeStr);
  const referenceMs = referenceDate.getTime();

  return {
    unit,
    referenceDate,
    referenceMs,
    original: units,
  };
}

/**
 * Parse a CF reference time string into a JavaScript Date.
 *
 * Supports formats:
 * - YYYY-MM-DD
 * - YYYY-MM-DD HH:MM:SS
 * - YYYY-MM-DD HH:MM:SS.ffffff
 * - YYYY-MM-DDTHH:MM:SS (ISO format)
 * - YYYY-MM-DDTHH:MM:SS.ffffffZ
 *
 * @param refTimeStr - Reference time string
 * @returns JavaScript Date object (UTC)
 */
function parseReferenceTime(refTimeStr: string): Date {
  // Normalize the string: replace T with space, remove trailing Z
  const normalized = refTimeStr.trim().replace("T", " ").replace(/Z$/i, "");

  // Try to parse ISO-like format: YYYY-MM-DD HH:MM:SS.ffffff
  const isoPattern =
    /^(-?\d+)-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?$/;
  const match = normalized.match(isoPattern);

  if (!match) {
    // Fallback: try native Date parsing
    const fallback = new Date(refTimeStr);
    if (isNaN(fallback.getTime())) {
      throw new Error(`Cannot parse reference time: "${refTimeStr}"`);
    }
    return fallback;
  }

  const [, yearStr, monthStr, dayStr, hourStr, minStr, secStr, fracStr] = match;

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // JS months are 0-indexed
  const day = parseInt(dayStr, 10);
  const hour = hourStr ? parseInt(hourStr, 10) : 0;
  const minute = minStr ? parseInt(minStr, 10) : 0;
  const second = secStr ? parseInt(secStr, 10) : 0;

  // Handle fractional seconds (convert to milliseconds)
  let millisecond = 0;
  if (fracStr) {
    // Pad or truncate to 3 digits for milliseconds
    const padded = fracStr.padEnd(3, "0").slice(0, 3);
    millisecond = parseInt(padded, 10);
  }

  // Create UTC date
  return new Date(
    Date.UTC(year, month, day, hour, minute, second, millisecond)
  );
}

/**
 * Convert numeric time value(s) to JavaScript Date object(s).
 *
 * @param times - Numeric time value or array of values
 * @param units - CF time units string (e.g., "days since 1970-01-01")
 * @param calendar - Calendar type (default: "standard")
 * @returns Date object or array of Date objects
 * @throws Error if calendar is not supported
 *
 * @example
 * ```ts
 * // Single value
 * const date = num2date(0, "days since 1970-01-01");
 * // Date: 1970-01-01T00:00:00.000Z
 *
 * // Array of values
 * const dates = num2date([0, 1, 2], "days since 1970-01-01");
 * // [Date: 1970-01-01, Date: 1970-01-02, Date: 1970-01-03]
 *
 * // Hours since reference
 * const date2 = num2date(24, "hours since 2000-01-01");
 * // Date: 2000-01-02T00:00:00.000Z
 * ```
 */
export function num2date(
  times: number,
  units: string,
  calendar?: CFCalendar
): Date;
export function num2date(
  times: number[],
  units: string,
  calendar?: CFCalendar
): Date[];
export function num2date(
  times: Float64Array | Float32Array | Int32Array,
  units: string,
  calendar?: CFCalendar
): Date[];
export function num2date(
  times: number | number[] | Float64Array | Float32Array | Int32Array,
  units: string,
  calendar: CFCalendar = "standard"
): Date | Date[] {
  // Validate calendar
  if (!GREGORIAN_CALENDARS.has(calendar)) {
    throw new Error(
      `Unsupported calendar: "${calendar}". Currently only Gregorian calendars are supported: standard, gregorian, proleptic_gregorian`
    );
  }

  const parsed = parseCFUnits(units);
  const msPerUnit = MS_PER_UNIT[parsed.unit];

  // Handle single value
  if (typeof times === "number") {
    return new Date(parsed.referenceMs + times * msPerUnit);
  }

  // Handle array or typed array
  const result: Date[] = [];
  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    // Handle NaN/null values
    if (t === null || t === undefined || Number.isNaN(t)) {
      result.push(new Date(NaN));
    } else {
      result.push(new Date(parsed.referenceMs + t * msPerUnit));
    }
  }
  return result;
}

/**
 * Convert JavaScript Date object(s) to numeric time value(s).
 *
 * @param dates - Date object or array of Date objects
 * @param units - CF time units string (e.g., "days since 1970-01-01")
 * @param calendar - Calendar type (default: "standard")
 * @returns Numeric time value or array of values
 * @throws Error if calendar is not supported
 *
 * @example
 * ```ts
 * // Single value
 * const num = date2num(new Date("1970-01-02"), "days since 1970-01-01");
 * // 1
 *
 * // Array of values
 * const nums = date2num([new Date("1970-01-01"), new Date("1970-01-02")], "days since 1970-01-01");
 * // [0, 1]
 * ```
 */
export function date2num(
  dates: Date,
  units: string,
  calendar?: CFCalendar
): number;
export function date2num(
  dates: Date[],
  units: string,
  calendar?: CFCalendar
): number[];
export function date2num(
  dates: Date | Date[],
  units: string,
  calendar: CFCalendar = "standard"
): number | number[] {
  // Validate calendar
  if (!GREGORIAN_CALENDARS.has(calendar)) {
    throw new Error(
      `Unsupported calendar: "${calendar}". Currently only Gregorian calendars are supported: standard, gregorian, proleptic_gregorian`
    );
  }

  const parsed = parseCFUnits(units);
  const msPerUnit = MS_PER_UNIT[parsed.unit];

  // Handle single value
  if (dates instanceof Date) {
    return (dates.getTime() - parsed.referenceMs) / msPerUnit;
  }

  // Handle array
  return dates.map((d) => {
    if (!d || isNaN(d.getTime())) {
      return NaN;
    }
    return (d.getTime() - parsed.referenceMs) / msPerUnit;
  });
}

/**
 * Check if a calendar type is supported.
 *
 * @param calendar - Calendar type string
 * @returns true if the calendar is supported
 */
export function isCalendarSupported(calendar: string): boolean {
  return GREGORIAN_CALENDARS.has(calendar.toLowerCase());
}

/**
 * Get the list of supported calendars.
 *
 * @returns Array of supported calendar names
 */
export function getSupportedCalendars(): string[] {
  return Array.from(GREGORIAN_CALENDARS);
}

/**
 * Check if attributes indicate CF time units.
 * CF time units follow the pattern: "<unit> since <reference_time>"
 *
 * @param attrs - Variable attributes record
 * @returns true if the attributes contain valid CF time units
 */
export function hasCFTimeUnits(attrs: Record<string, unknown>): boolean {
  const units = attrs.units;
  return typeof units === "string" && /^\s*\w+\s+since\s+.+$/i.test(units);
}

/**
 * Convert CF time values to Unix timestamp (seconds since 1970-01-01).
 * Used for lazy conversion when accessing zarr data with CF time units.
 *
 * @param data - Array of numeric time values
 * @param units - CF time units string (e.g., "days since 1970-01-01")
 * @param calendar - CF calendar type (defaults to "standard")
 * @returns Float64Array of Unix timestamps in seconds, or null if calendar unsupported
 */
export function cftimeToUnixSeconds(
  data: ArrayLike<number | bigint>,
  units: string,
  calendar = "standard"
): Float64Array | null {
  // Check calendar support
  if (!isCalendarSupported(calendar)) {
    return null;
  }

  const parsed = parseCFUnits(units);
  const msPerUnit = MS_PER_UNIT[parsed.unit];
  const refMs = parsed.referenceMs;

  const result = new Float64Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const v = Number(data[i]);
    if (Number.isNaN(v)) {
      result[i] = NaN;
    } else {
      // Convert to milliseconds, then to Unix seconds
      result[i] = (refMs + v * msPerUnit) / 1000;
    }
  }
  return result;
}
