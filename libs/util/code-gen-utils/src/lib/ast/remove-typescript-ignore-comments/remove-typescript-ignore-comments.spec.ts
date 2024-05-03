import { print } from "recast";
import { parse } from "../../parse/main";
import { removeTSIgnoreComments } from "./main";

describe("removeTSIgnoreComments", () => {
  test("removes //@ts-ignore comments", () => {
    const file = parse(`//@ts-ignore
export const c = 1;`);
    removeTSIgnoreComments(file);
    expect(print(file).code).toEqual(`export const c = 1;`);
  });
});
