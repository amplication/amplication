import { print, parse } from "@amplication/code-gen-utils";
import { builders } from "ast-types";

import { removeIdentifierFromModuleDecorator } from "./nestjs-code-generation";
import * as recast from "recast";

const actualRecast = jest.requireActual("recast");

jest.mock("recast");
// @ts-ignore
recast.parse = jest.fn(actualRecast.parse).mockName("parseMock");
// @ts-ignore
recast.print = jest.fn(actualRecast.print);
// @ts-ignore
recast.visit = jest.fn(actualRecast.visit);

const EXAMPLE_CONTROLLER_IDENTIFIER = builders.identifier(`ExampleController`);
const EXAMPLE_RESOLVER_IDENTIFIER = builders.identifier(`ExampleResolver`);

describe("removeIdentifierFromModuleDecorator", () => {
  test("removes controller that is last in the array", () => {
    const file = parse(`
    @Module({
      imports: [ExampleModuleBase],
      controllers: [ExampleController],
      providers: [ExampleService, ExampleResolver],
      exports: [ExampleService]
    })
    export class ExampleModule {}
    `);
    removeIdentifierFromModuleDecorator(file, EXAMPLE_CONTROLLER_IDENTIFIER);
    expect(print(file).code).toEqual(`
    @Module({
      imports: [ExampleModuleBase],
      providers: [ExampleService, ExampleResolver],
      exports: [ExampleService]
    })
    export class ExampleModule {}
    `);
  });

  test("removes resolver that is not last in the array", () => {
    const file = parse(`
    @Module({
      imports: [ExampleModuleBase],
      controllers: [ExampleController],
      providers: [ExampleService, ExampleResolver],
      exports: [ExampleService]
    })
    export class ExampleModule {}
    `);
    removeIdentifierFromModuleDecorator(file, EXAMPLE_RESOLVER_IDENTIFIER);
    expect(print(file).code).toEqual(`
    @Module({
      imports: [ExampleModuleBase],
      controllers: [ExampleController],
      providers: [ExampleService],
      exports: [ExampleService]
    })
    export class ExampleModule {}
    `);
  });

  test("removes controller and resolver", () => {
    const file = parse(`
    @Module({
      imports: [ExampleModuleBase],
      controllers: [ExampleController],
      providers: [ExampleService, ExampleResolver],
      exports: [ExampleService]
    })
    export class ExampleModule {}
    `);
    removeIdentifierFromModuleDecorator(file, EXAMPLE_RESOLVER_IDENTIFIER);
    removeIdentifierFromModuleDecorator(file, EXAMPLE_CONTROLLER_IDENTIFIER);
    expect(print(file).code).toEqual(`
    @Module({
      imports: [ExampleModuleBase],
      providers: [ExampleService],
      exports: [ExampleService]
    })
    export class ExampleModule {}
    `);
  });
});
