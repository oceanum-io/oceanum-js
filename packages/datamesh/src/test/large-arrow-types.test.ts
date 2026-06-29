import { describe, expect, test } from "vitest";
import {
  Table,
  Vector,
  makeData,
  vectorFromArray,
  Float64,
  LargeUtf8,
  LargeBinary,
} from "apache-arrow";

import { Dataset } from "../lib/datamodel";

// Regression: Arrow LargeUtf8 / LargeBinary columns broke Dataset.fromArrow.
// pandas/polars pyarrow-backed string columns serialize as `large_string`
// (LargeUtf8, typeId 20) rather than `string` (Utf8, typeId 5); the dtype
// mapper only special-cased Utf8, so a LargeUtf8 column produced an
// unrecognised "largeutf8" dtype and threw
// `Unknown or unsupported data_type: largeutf8`. LargeBinary (typeId 19) had
// the matching gap in the binary base64 branch.

const enc = new TextEncoder();

const largeUtf8Vector = (strings: string[]): Vector => {
  const bytes = strings.map((s) => enc.encode(s));
  const total = bytes.reduce((n, b) => n + b.length, 0);
  const data = new Uint8Array(total);
  const valueOffsets = new BigInt64Array(strings.length + 1);
  let offset = 0;
  bytes.forEach((b, i) => {
    data.set(b, offset);
    offset += b.length;
    valueOffsets[i + 1] = BigInt(offset);
  });
  return new Vector([
    makeData({
      type: new LargeUtf8(),
      length: strings.length,
      nullCount: 0,
      valueOffsets,
      data,
    }),
  ]);
};

const largeBinaryVector = (buffers: Uint8Array[]): Vector => {
  const total = buffers.reduce((n, b) => n + b.length, 0);
  const data = new Uint8Array(total);
  const valueOffsets = new BigInt64Array(buffers.length + 1);
  let offset = 0;
  buffers.forEach((b, i) => {
    data.set(b, offset);
    offset += b.length;
    valueOffsets[i + 1] = BigInt(offset);
  });
  return new Vector([
    makeData({
      type: new LargeBinary(),
      length: buffers.length,
      nullCount: 0,
      valueOffsets,
      data,
    }),
  ]);
};

describe("fromArrow with large Arrow types", () => {
  test("decodes LargeUtf8 and LargeBinary columns", async () => {
    const table = new Table({
      name: largeUtf8Vector(["alpha", "beta", "gamma"]),
      blob: largeBinaryVector([
        Uint8Array.of(1, 2, 3),
        Uint8Array.of(4, 5),
        Uint8Array.of(6),
      ]),
      value: vectorFromArray([1.5, 2.5, 3.5], new Float64()),
    });

    const dataset = await Dataset.fromArrow(table, {});
    const rows = await dataset.asDataframe();

    expect(rows).toHaveLength(3);
    // LargeUtf8 round-trips as plain strings.
    expect(rows.map((r) => r.name)).toEqual(["alpha", "beta", "gamma"]);
    // Numeric control column is unaffected.
    expect(rows.map((r) => r.value)).toEqual([1.5, 2.5, 3.5]);
    // LargeBinary is base64-encoded, exactly like Binary.
    expect(rows[0].blob).toBe(Buffer.from([1, 2, 3]).toString("base64"));
    expect(rows.map((r) => r.blob)).toEqual([
      Buffer.from([1, 2, 3]).toString("base64"),
      Buffer.from([4, 5]).toString("base64"),
      Buffer.from([6]).toString("base64"),
    ]);
  });
});
