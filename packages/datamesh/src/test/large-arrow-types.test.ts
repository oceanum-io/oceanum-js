import { describe, expect, test } from "vitest";
import {
  Table,
  Vector,
  makeData,
  vectorFromArray,
  Dictionary,
  Float64,
  Int32,
  LargeUtf8,
  LargeBinary,
  Utf8,
} from "apache-arrow";

import { Dataset } from "../lib/datamodel";

// Regression: Arrow LargeUtf8 / LargeBinary / dictionary-string columns broke
// Dataset.fromArrow. pandas/polars pyarrow-backed string columns serialize as
// `large_string` (LargeUtf8, typeId 20) rather than `string` (Utf8, typeId 5),
// and pandas `category` / polars Categorical|Enum columns serialize as
// Dictionary<_, Utf8>. The dtype mapper only special-cased Utf8, so these
// produced unrecognised dtypes and threw e.g.
// `Unknown or unsupported data_type: largeutf8`. LargeBinary (typeId 19) had
// the matching gap in the binary base64 branch.

// LargeUtf8/LargeBinary use 64-bit offset buffers (BigInt64Array) that
// vectorFromArray can't build in this apache-arrow version, so the vectors are
// assembled manually from a packed data buffer + cumulative offsets.
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
  test("decodes LargeUtf8, LargeBinary and dictionary-string columns", async () => {
    const table = new Table({
      name: largeUtf8Vector(["alpha", "beta", "gamma"]),
      blob: largeBinaryVector([
        Uint8Array.of(1, 2, 3),
        Uint8Array.of(4, 5),
        Uint8Array.of(6),
      ]),
      // pandas `category` / polars Categorical|Enum -> Dictionary<Int32, Utf8>.
      color: vectorFromArray(
        ["red", "green", "red"],
        new Dictionary(new Utf8(), new Int32()),
      ),
      value: vectorFromArray([1.5, 2.5, 3.5], new Float64()),
    });

    const dataset = await Dataset.fromArrow(table, {});
    const rows = await dataset.asDataframe();

    expect(rows).toHaveLength(3);
    // LargeUtf8 round-trips as plain strings.
    expect(rows.map((r) => r.name)).toEqual(["alpha", "beta", "gamma"]);
    // Dictionary-encoded strings decode to plain strings.
    expect(rows.map((r) => r.color)).toEqual(["red", "green", "red"]);
    // Numeric control column is unaffected.
    expect(rows.map((r) => r.value)).toEqual([1.5, 2.5, 3.5]);
    // LargeBinary is base64-encoded, exactly like Binary.
    expect(rows.map((r) => r.blob)).toEqual([
      Buffer.from([1, 2, 3]).toString("base64"),
      Buffer.from([4, 5]).toString("base64"),
      Buffer.from([6]).toString("base64"),
    ]);
  });
});
