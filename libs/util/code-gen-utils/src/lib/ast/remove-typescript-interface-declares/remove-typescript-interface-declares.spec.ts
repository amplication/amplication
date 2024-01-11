import { parse } from "../../parse/main";
import { removeTSInterfaceDeclares } from "./main";
import { print } from "recast";

describe("removeTSInterfaceDeclares", () => {
  test("removes interface declares", () => {
    const file = parse(`declare interface A {}; interface B {}`);
    removeTSInterfaceDeclares(file);
    expect(print(file).code).toEqual(`interface B {}`);
  });
});
