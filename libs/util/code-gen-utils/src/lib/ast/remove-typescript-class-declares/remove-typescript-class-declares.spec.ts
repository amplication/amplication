import { print } from "recast";
import { parse } from "../../parse/main";
import { removeTSClassDeclares } from "./main";

describe("removeTSClassDeclares", () => {
  test("removes typescript class declares", () => {
    const file = parse(`declare class A {}; interface B {}`);
    removeTSClassDeclares(file);
    expect(print(file).code).toEqual(`interface B {}`);
  });
});
