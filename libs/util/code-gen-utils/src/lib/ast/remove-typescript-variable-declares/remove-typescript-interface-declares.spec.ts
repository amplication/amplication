import { print } from "recast";
import { parse } from "../../parse/main";
import { removeTSVariableDeclares } from "./main";

describe("removeTSVariableDeclares", () => {
  it("should not remove typescript variables", () => {
    const file = parse(
      `var a = 1;
let b = 2;
const c = 3;`
    );
    removeTSVariableDeclares(file);
    expect(print(file).code).toEqual(`var a = 1;
let b = 2;
const c = 3;`);
  });
});
test("removes typescript variable declaration", () => {
  const file = parse(
    `declare interface A {};
interface B {};
declare var c;`
  );
  removeTSVariableDeclares(file);
  expect(print(file).code).toEqual(`declare interface A {}
interface B {}`);
});
