import { describe, test, expect } from "vitest";
import {
  parseCFUnits,
  num2date,
  date2num,
  isCalendarSupported,
  getSupportedCalendars,
  hasCFTimeUnits,
  cftimeToUnixSeconds,
} from "../lib/cftime";

describe("cftime", () => {
  describe("parseCFUnits", () => {
    test("parses days since reference", () => {
      const parsed = parseCFUnits("days since 1970-01-01");
      expect(parsed.unit).toBe("days");
      expect(parsed.referenceDate.toISOString()).toBe(
        "1970-01-01T00:00:00.000Z"
      );
    });

    test("parses hours since reference with time", () => {
      const parsed = parseCFUnits("hours since 2000-01-01 00:00:00");
      expect(parsed.unit).toBe("hours");
      expect(parsed.referenceDate.toISOString()).toBe(
        "2000-01-01T00:00:00.000Z"
      );
    });

    test("parses seconds since reference", () => {
      const parsed = parseCFUnits("seconds since 1970-01-01 00:00:00");
      expect(parsed.unit).toBe("seconds");
      expect(parsed.referenceMs).toBe(0);
    });

    test("parses unit aliases", () => {
      expect(parseCFUnits("d since 1970-01-01").unit).toBe("days");
      expect(parseCFUnits("hr since 1970-01-01").unit).toBe("hours");
      expect(parseCFUnits("min since 1970-01-01").unit).toBe("minutes");
      expect(parseCFUnits("sec since 1970-01-01").unit).toBe("seconds");
      expect(parseCFUnits("ms since 1970-01-01").unit).toBe("milliseconds");
      expect(parseCFUnits("us since 1970-01-01").unit).toBe("microseconds");
    });

    test("handles ISO format with T separator", () => {
      const parsed = parseCFUnits("days since 2000-01-01T12:00:00");
      expect(parsed.referenceDate.toISOString()).toBe(
        "2000-01-01T12:00:00.000Z"
      );
    });

    test("handles fractional seconds", () => {
      const parsed = parseCFUnits("seconds since 2000-01-01 00:00:00.500");
      expect(parsed.referenceDate.getUTCMilliseconds()).toBe(500);
    });

    test("throws on invalid units string", () => {
      expect(() => parseCFUnits("invalid")).toThrow("Invalid CF time units");
    });

    test("throws on unsupported time unit", () => {
      expect(() => parseCFUnits("weeks since 1970-01-01")).toThrow(
        "Unsupported time unit"
      );
    });
  });

  describe("num2date", () => {
    test("converts single value", () => {
      const date = num2date(0, "days since 1970-01-01");
      expect(date.toISOString()).toBe("1970-01-01T00:00:00.000Z");
    });

    test("converts positive days", () => {
      const date = num2date(1, "days since 1970-01-01");
      expect(date.toISOString()).toBe("1970-01-02T00:00:00.000Z");
    });

    test("converts negative days", () => {
      const date = num2date(-1, "days since 1970-01-01");
      expect(date.toISOString()).toBe("1969-12-31T00:00:00.000Z");
    });

    test("converts hours", () => {
      const date = num2date(24, "hours since 2000-01-01");
      expect(date.toISOString()).toBe("2000-01-02T00:00:00.000Z");
    });

    test("converts fractional days", () => {
      const date = num2date(0.5, "days since 2000-01-01");
      expect(date.toISOString()).toBe("2000-01-01T12:00:00.000Z");
    });

    test("converts array of values", () => {
      const dates = num2date([0, 1, 2], "days since 1970-01-01");
      expect(dates).toHaveLength(3);
      expect(dates[0].toISOString()).toBe("1970-01-01T00:00:00.000Z");
      expect(dates[1].toISOString()).toBe("1970-01-02T00:00:00.000Z");
      expect(dates[2].toISOString()).toBe("1970-01-03T00:00:00.000Z");
    });

    test("converts Float64Array", () => {
      const times = new Float64Array([0, 1, 2]);
      const dates = num2date(times, "days since 1970-01-01");
      expect(dates).toHaveLength(3);
      expect(dates[0].toISOString()).toBe("1970-01-01T00:00:00.000Z");
    });

    test("handles NaN values in array", () => {
      const dates = num2date([0, NaN, 2], "days since 1970-01-01");
      expect(dates[0].toISOString()).toBe("1970-01-01T00:00:00.000Z");
      expect(isNaN(dates[1].getTime())).toBe(true);
      expect(dates[2].toISOString()).toBe("1970-01-03T00:00:00.000Z");
    });

    test("throws on unsupported calendar", () => {
      expect(() =>
        num2date(0, "days since 1970-01-01", "noleap" as any)
      ).toThrow("Unsupported calendar");
    });

    test("accepts supported calendars", () => {
      expect(() =>
        num2date(0, "days since 1970-01-01", "standard")
      ).not.toThrow();
      expect(() =>
        num2date(0, "days since 1970-01-01", "gregorian")
      ).not.toThrow();
      expect(() =>
        num2date(0, "days since 1970-01-01", "proleptic_gregorian")
      ).not.toThrow();
    });
  });

  describe("date2num", () => {
    test("converts single date", () => {
      const num = date2num(
        new Date("1970-01-02T00:00:00Z"),
        "days since 1970-01-01"
      );
      expect(num).toBe(1);
    });

    test("converts array of dates", () => {
      const dates = [
        new Date("1970-01-01T00:00:00Z"),
        new Date("1970-01-02T00:00:00Z"),
      ];
      const nums = date2num(dates, "days since 1970-01-01");
      expect(nums).toEqual([0, 1]);
    });

    test("round-trips correctly", () => {
      const original = new Date("2023-06-15T14:30:00Z");
      const num = date2num(original, "seconds since 2000-01-01");
      const converted = num2date(num, "seconds since 2000-01-01");
      expect(converted.getTime()).toBe(original.getTime());
    });
  });

  describe("calendar support", () => {
    test("isCalendarSupported returns true for Gregorian calendars", () => {
      expect(isCalendarSupported("standard")).toBe(true);
      expect(isCalendarSupported("gregorian")).toBe(true);
      expect(isCalendarSupported("proleptic_gregorian")).toBe(true);
    });

    test("isCalendarSupported returns false for non-Gregorian calendars", () => {
      expect(isCalendarSupported("noleap")).toBe(false);
      expect(isCalendarSupported("365_day")).toBe(false);
      expect(isCalendarSupported("360_day")).toBe(false);
      expect(isCalendarSupported("julian")).toBe(false);
    });

    test("getSupportedCalendars returns all supported calendars", () => {
      const calendars = getSupportedCalendars();
      expect(calendars).toContain("standard");
      expect(calendars).toContain("gregorian");
      expect(calendars).toContain("proleptic_gregorian");
    });
  });

  describe("hasCFTimeUnits", () => {
    test("returns true for valid CF time units", () => {
      expect(hasCFTimeUnits({ units: "days since 1970-01-01" })).toBe(true);
      expect(hasCFTimeUnits({ units: "hours since 2000-01-01 00:00:00" })).toBe(
        true
      );
      expect(
        hasCFTimeUnits({ units: "seconds since 1970-01-01T00:00:00Z" })
      ).toBe(true);
    });

    test("returns false for non-CF time units", () => {
      expect(hasCFTimeUnits({ units: "meters" })).toBe(false);
      expect(hasCFTimeUnits({ units: "kg/m^2" })).toBe(false);
      expect(hasCFTimeUnits({})).toBe(false);
      expect(hasCFTimeUnits({ units: 123 })).toBe(false);
    });
  });

  describe("cftimeToUnixSeconds", () => {
    test("converts array to Unix seconds", () => {
      const data = [0, 1, 2];
      const result = cftimeToUnixSeconds(data, "days since 1970-01-01");
      expect(result).toBeInstanceOf(Float64Array);
      expect(result![0]).toBe(0);
      expect(result![1]).toBe(86400); // 1 day in seconds
      expect(result![2]).toBe(172800); // 2 days in seconds
    });

    test("handles different reference dates", () => {
      const data = [0];
      const result = cftimeToUnixSeconds(data, "days since 2000-01-01");
      // 2000-01-01 is 946684800 seconds after Unix epoch
      expect(result![0]).toBe(946684800);
    });

    test("returns null for unsupported calendar", () => {
      const data = [0, 1];
      const result = cftimeToUnixSeconds(
        data,
        "days since 1970-01-01",
        "noleap"
      );
      expect(result).toBeNull();
    });

    test("handles NaN values", () => {
      const data = [0, NaN, 2];
      const result = cftimeToUnixSeconds(data, "days since 1970-01-01");
      expect(result![0]).toBe(0);
      expect(Number.isNaN(result![1])).toBe(true);
      expect(result![2]).toBe(172800);
    });
  });
});
