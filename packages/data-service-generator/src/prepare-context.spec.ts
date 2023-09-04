import { Entity } from "@amplication/code-gen-types";
import { prepareEntityPluralName } from "./prepare-context";

describe("prepareContext", () => {
  it('should pluralize entity names and add "Items" if necessary', () => {
    const entities: Entity[] = [
      { name: "user", pluralName: "" } as unknown as Entity,
      { name: "person", pluralName: "" } as unknown as Entity,
      { name: "mouse", pluralName: "" } as unknown as Entity,
    ];
    const expected: Entity[] = [
      { name: "user", pluralName: "users" } as unknown as Entity,
      { name: "person", pluralName: "people" } as unknown as Entity,
      { name: "mouse", pluralName: "mice" } as unknown as Entity,
    ];

    const result = prepareEntityPluralName(entities);

    expect(result).toEqual(expected);
  });

  it('should not add "Items" if the resulting plural is already suffixed with "s"', () => {
    const entities: Entity[] = [
      { name: "status", pluralName: "" } as unknown as Entity,
      { name: "address", pluralName: "" } as unknown as Entity,
    ];
    const expected: Entity[] = [
      { name: "status", pluralName: "statuses" } as unknown as Entity,
      { name: "address", pluralName: "addresses" } as unknown as Entity,
    ];

    const result = prepareEntityPluralName(entities);

    expect(result).toEqual(expected);
  });

  it("should return the same array if the input array is empty", () => {
    const entities: Entity[] = [];

    const result = prepareEntityPluralName(entities);

    expect(result).toEqual(entities);
  });

  it("should not modify the original array", () => {
    const entities: Entity[] = [
      { name: "foo", pluralName: "" } as unknown as Entity,
      { name: "bar", pluralName: "" } as unknown as Entity,
    ];
    const originalEntities = entities.slice();

    prepareEntityPluralName(entities);

    expect(entities).toEqual(originalEntities);
  });

  it("should use the correct pluralization rules", () => {
    const entities: Entity[] = [
      { name: "person", pluralName: "" } as unknown as Entity,
      { name: "goose", pluralName: "" } as unknown as Entity,
      { name: "ox", pluralName: "" } as unknown as Entity,
      { name: "child", pluralName: "" } as unknown as Entity,
    ];
    const expected: Entity[] = [
      { name: "person", pluralName: "people" } as unknown as Entity,
      { name: "goose", pluralName: "geese" } as unknown as Entity,
      { name: "ox", pluralName: "oxen" } as unknown as Entity,
      { name: "child", pluralName: "children" } as unknown as Entity,
    ];

    const result = prepareEntityPluralName(entities);

    expect(result).toEqual(expected);
  });
});
