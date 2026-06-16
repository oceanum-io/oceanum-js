import { describe, test, expect } from "vitest";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Query } from "../lib/query";

dayjs.extend(duration);

const times = (timefilter: { times: (string | Date | object)[] }) =>
  new Query({ datasource: "test", timefilter: timefilter as never }).timefilter
    ?.times;

describe("timefilter ISO8601 period handling", () => {
  test("positive ISO8601 period strings resolve after now and are preserved", () => {
    expect(times({ times: ["P7D", "P1D"] })).toEqual(["P7D", "P1D"]);
  });

  test("negative ISO8601 period strings (ISO8601-2) are preserved", () => {
    // Negative => before now, positive => after now, for both tstart and tend.
    expect(times({ times: ["-P7D", "P1D"] })).toEqual(["-P7D", "P1D"]);
    expect(times({ times: ["-P7D", "-P1D"] })).toEqual(["-P7D", "-P1D"]);
  });

  test("negative period with a time component keeps its sign", () => {
    expect(times({ times: ["-P1DT12H", "PT6H"] })).toEqual([
      "-P1DT12H",
      "PT6H",
    ]);
  });

  test("dayjs duration objects preserve their sign", () => {
    expect(
      times({
        times: [dayjs.duration(-7, "days"), dayjs.duration(2, "days")],
      }),
    ).toEqual(["-P7D", "P2D"]);
  });

  test("absolute Date values become ISO8601 datetimes", () => {
    expect(times({ times: [new Date("2020-01-01T00:00:00Z")] })).toEqual([
      "2020-01-01T00:00:00.000Z",
    ]);
  });

  test("ISO8601 datetime strings are normalised, not treated as periods", () => {
    expect(
      times({ times: ["2020-01-01T00:00:00Z", "2020-01-02T00:00:00Z"] }),
    ).toEqual(["2020-01-01T00:00:00.000Z", "2020-01-02T00:00:00.000Z"]);
  });

  test("type defaults to range", () => {
    const q = new Query({
      datasource: "test",
      timefilter: { times: ["-P7D", "P1D"] },
    });
    expect(q.timefilter?.type).toBe("range");
  });
});
