import { describe, it, expect } from "vitest";
import { Dataset } from "../lib/datamodel";
import type { Schema } from "../lib/datasource";

// Regression: Dataset.init on a variable whose data is a plain Array of
// BigInt threw `Unsupported data type: BigInt` (getDtype handles
// BigInt64Array but not a BigInt scalar reached by unwrapping a plain
// array). Plain BigInt arrays are a normal client-side shape: consumers that
// index/filter an int64 column (e.g. the EIDOS framework's array_indexer on
// a time-filtered query) rebuild BigInt64Array data into Array<BigInt>, then
// hand the result back to Dataset.init to wrap as an inline dataset — seen
// as the shark-demo 'shark-track' transform failing to wrap its result.
describe("Dataset.init with plain BigInt array data", () => {
  it("infers int64 and round-trips the values", async () => {
    const schema: Schema = {
      dimensions: { record: 3 },
      variables: {
        weight: {
          data: [539n, 540n, 541n],
          dimensions: ["record"],
          attributes: {},
        },
      },
      attributes: {},
    } as unknown as Schema;
    const ds = await Dataset.init(schema, {});
    expect(ds.variables.weight.arr.dtype).toBe("int64");
    const out = await ds.variables.weight.get();
    expect(Array.from(out as ArrayLike<bigint>)).toEqual([539n, 540n, 541n]);
  });

  it("still infers int64 for BigInt64Array data (pre-existing path)", async () => {
    const schema: Schema = {
      dimensions: { record: 2 },
      variables: {
        idx: {
          data: new BigInt64Array([0n, 1n]),
          dimensions: ["record"],
          attributes: {},
        },
      },
      attributes: {},
    } as unknown as Schema;
    const ds = await Dataset.init(schema, {});
    expect(ds.variables.idx.arr.dtype).toBe("int64");
  });
});
