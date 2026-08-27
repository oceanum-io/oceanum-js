import { describe, it, expect } from "vitest";
import * as zarr from "zarrita";
import { DataVar } from "../lib/datamodel";
import type { HttpZarr } from "../lib/datamodel";
// `DataType` is zarrita's; datamodel.ts imports it but does not re-export it.
import type { DataType } from "zarrita";

// Regression: zarr v2 object columns written from Python `bytes` values carry
// the numcodecs "vlen-bytes" filter. zarrita's registry only ships
// "vlen-utf8", so the first chunk decode threw `Unknown codec: vlen-bytes`
// (seen as the shark-demo track layer's seed query failing on its `name`
// column). zarr.ts now registers the codec, decoding items to UTF-8 strings
// in line with how fixed-width `|S<n>` bytes columns are surfaced.

const enc = (o: unknown) => new TextEncoder().encode(JSON.stringify(o));

/** Open an in-memory zarr v2 object array with the vlen-bytes filter. */
const openArray = async (chunk: Uint8Array, shape: number[] = [3]) => {
  const store = new Map<string, Uint8Array>();
  store.set("/.zgroup", enc({ zarr_format: 2 }));
  store.set(
    "/v/.zarray",
    enc({
      zarr_format: 2,
      shape,
      chunks: shape,
      dtype: "|O",
      compressor: null,
      fill_value: null,
      order: "C",
      filters: [{ id: "vlen-bytes" }],
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

/**
 * numcodecs VLenBytes wire format: uint32-LE item count, then per item a
 * uint32-LE byte length followed by the raw bytes.
 */
const vlenBytesFor = (words: string[]) => {
  const utf8 = new TextEncoder();
  const items = words.map((w) => utf8.encode(w));
  const out = new Uint8Array(4 + items.reduce((n, b) => n + 4 + b.length, 0));
  const dv = new DataView(out.buffer);
  dv.setUint32(0, items.length, true);
  let pos = 4;
  for (const b of items) {
    dv.setUint32(pos, b.length, true);
    pos += 4;
    out.set(b, pos);
    pos += b.length;
  }
  return out;
};

describe("DataVar.get() with the v2 vlen-bytes filter", () => {
  it("reads a vlen-bytes object column as strings", async () => {
    const arr = await openArray(
      vlenBytesFor(["ironbound", "martha", "andromache"]),
    );
    expect(arr.dtype).toBe("v2:object");
    const out = await dataVar(arr, ["d0"]).get();
    expect(Array.from(out as ArrayLike<string>)).toEqual([
      "ironbound",
      "martha",
      "andromache",
    ]);
  });

  it("handles empty and multi-byte UTF-8 items", async () => {
    const arr = await openArray(vlenBytesFor(["", "mākō", "白鲨"]));
    const out = await dataVar(arr, ["d0"]).get();
    expect(Array.from(out as ArrayLike<string>)).toEqual(["", "mākō", "白鲨"]);
  });
});
