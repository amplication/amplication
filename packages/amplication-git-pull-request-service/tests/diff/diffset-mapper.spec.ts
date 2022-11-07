import { DiffSet } from "dir-compare";
import { mapDiffSetToPrModule } from "../../src/diff/diffset-mapper";
import { DiffVisitorFn } from "../../src/diff/diff.types";

describe("Testing the diffset module mapper", () => {
  it("should return an empty array if no visitors are provided", () => {
    const diffSet: DiffSet = [];
    const visitors: DiffVisitorFn[] = [];
    const result = mapDiffSetToPrModule(diffSet, visitors);
    expect(result).toEqual([]);
  });

  it("should send the diffset to the visitors functions", () => {
    const visitor = jest.fn();
    const diffSet: DiffSet = [
      {
        level: 0,
        permissionDeniedState: "access-ok",
        reason: "different-content",
        relativePath: "/",
        state: "equal",
        type1: "file",
        type2: "missing",
      },
      {
        level: 0,
        permissionDeniedState: "access-ok",
        reason: "different-content",
        relativePath: "/",
        state: "equal",
        type1: "file",
        type2: "missing",
      },
    ];
    const visitors: DiffVisitorFn[] = [visitor];
    mapDiffSetToPrModule(diffSet, visitors);

    expect(visitor).toBeCalledTimes(2);
    expect(visitor).toBeCalledWith(diffSet.at(0));
    expect(visitor).toBeCalledWith(diffSet.at(1));
  });
});
