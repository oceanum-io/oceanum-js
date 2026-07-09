import { describe, it, expect } from "vitest";
import * as zarr from "zarrita";
import { DataVar } from "../lib/datamodel";
import type { DataType, HttpZarr } from "../lib/datamodel";

// Regression: numpy fixed-width string columns (`|S<n>` bytes, `<U<n>` unicode)
// open as zarrita dtypes `v2:S<n>` / `v2:U<n>` — NOT `v2:object`. Their chunk
// data is a lazy Byte/UnicodeStringArray view: iterable, but with no `.slice`.
// DataVar.get() used to route them down the numeric branch, where `unravel`
// calls `data.slice(...)` and threw `TypeError: r.slice is not a function`.
// This bit any query grouping by a string variable (e.g. an EIDOS worldlayer
// with `timeSelect.groupby: "drone_id"`).

const enc = (o: unknown) => new TextEncoder().encode(JSON.stringify(o));

/** Open an in-memory zarr v2 array with the given dtype and raw chunk bytes. */
const openArray = async (
  dtype: string,
  chunk: Uint8Array,
  shape: number[] = [3],
) => {
  const store = new Map<string, Uint8Array>();
  store.set("/.zgroup", enc({ zarr_format: 2 }));
  store.set(
    "/v/.zarray",
    enc({
      zarr_format: 2,
      shape,
      chunks: shape,
      dtype,
      compressor: null,
      fill_value: null,
      order: "C",
      filters: null,
      dimension_separator: ".",
    }),
  );
  store.set(
    "/v/.zattrs",
    enc({ _ARRAY_DIMENSIONS: shape.map((_, i) => `d${i}`) }),
  );
  store.set(`/v/${shape.map(() => 0).join(".")}`, chunk);
  return await zarr.open(zarr.root(store).resolve("/v"), { kind: "array" });
};

const dataVar = (arr: Awaited<ReturnType<typeof openArray>>, dims: string[]) =>
  new DataVar<DataType, HttpZarr>(
    "v",
    dims,
    {},
    arr as unknown as zarr.Array<DataType, zarr.AsyncReadable>,
  );

/** ASCII bytes for `|S<width>`. */
const bytesFor = (words: string[], width: number) => {
  const out = new Uint8Array(words.length * width);
  words.forEach((w, i) =>
    new TextEncoder().encodeInto(w, out.subarray(i * width, (i + 1) * width)),
  );
  return out;
};

/** UTF-32LE code points for `<U<width>`. */
const utf32For = (words: string[], width: number) => {
  const out = new Uint8Array(words.length * width * 4);
  const dv = new DataView(out.buffer);
  words.forEach((w, i) =>
    [...w].forEach((ch, j) =>
      dv.setUint32((i * width + j) * 4, ch.codePointAt(0) as number, true),
    ),
  );
  return out;
};

describe("DataVar.get() with numpy fixed-width string dtypes", () => {
  it("reads a |S<n> (bytes) column as strings", async () => {
    const arr = await openArray("|S4", bytesFor(["auv1", "auv2", "auv3"], 4));
    expect(arr.dtype).toBe("v2:S4");
    const out = await dataVar(arr, ["d0"]).get();
    expect(Array.from(out as ArrayLike<string>)).toEqual([
      "auv1",
      "auv2",
      "auv3",
    ]);
  });

  it("reads a <U<n> (unicode) column as strings", async () => {
    const arr = await openArray("<U3", utf32For(["abc", "def", "ghi"], 3));
    expect(arr.dtype).toBe("v2:U3");
    const out = await dataVar(arr, ["d0"]).get();
    expect(Array.from(out as ArrayLike<string>)).toEqual(["abc", "def", "ghi"]);
  });

  it("preserves shape for a 2-D fixed-width string array", async () => {
    const arr = await openArray(
      "|S2",
      bytesFor(["aa", "bb", "cc", "dd"], 2),
      [2, 2],
    );
    const out = await dataVar(arr, ["d0", "d1"]).get();
    expect(out).toEqual([
      ["aa", "bb"],
      ["cc", "dd"],
    ]);
  });

  it("still reads numeric columns (the pre-existing branch) unchanged", async () => {
    const buf = new Uint8Array(24);
    new DataView(buf.buffer).setFloat64(0, 1.5, true);
    new DataView(buf.buffer).setFloat64(8, 2.5, true);
    new DataView(buf.buffer).setFloat64(16, 3.5, true);
    const arr = await openArray("<f8", buf);
    expect(arr.dtype).toBe("float64");
    const out = await dataVar(arr, ["d0"]).get();
    expect(Array.from(out as ArrayLike<number>)).toEqual([1.5, 2.5, 3.5]);
  });
});
