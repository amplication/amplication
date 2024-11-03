import { jsonPathStringFilterToPrismaFilter } from "./JsonPathStringFilterToPrismaFilter";
import { JsonPathStringFilter } from "../dto/JsonPathStringFilter";

describe("jsonPathStringFilterToPrismaFilter", () => {
  it("should return undefined if filter is null", () => {
    const result = jsonPathStringFilterToPrismaFilter(null, "propertyName");
    expect(result).toBeUndefined();
  });

  it("should return undefined if filter.matchAll is null", () => {
    const filter: JsonPathStringFilter = { matchAll: null };
    const result = jsonPathStringFilterToPrismaFilter(filter, "propertyName");
    expect(result).toBeUndefined();
  });

  it("should return undefined if filter.matchAll is empty", () => {
    const filter: JsonPathStringFilter = { matchAll: [] };
    const result = jsonPathStringFilterToPrismaFilter(filter, "propertyName");
    expect(result).toBeUndefined();
  });

  it("should return a single prisma filter if matchAll has one item", () => {
    const filter: JsonPathStringFilter = {
      matchAll: [
        {
          path: "path.to.property",
          equals: "value",
          arrayContains: "item1",
          stringContains: "substring",
        },
      ],
    };
    const result = jsonPathStringFilterToPrismaFilter(filter, "propertyName");
    expect(result).toEqual({
      propertyName: {
        path: ["path", "to", "property"],
        equals: "value",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        array_contains: "item1",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        string_contains: "substring",
      },
    });
  });

  it("should return an AND prisma filter if matchAll has multiple items", () => {
    const filter: JsonPathStringFilter = {
      matchAll: [
        {
          path: "path.to.property1",
          equals: "value1",
          arrayContains: "item1",
          stringContains: "substring1",
        },
        {
          path: "path.to.property2",
          equals: "value2",
          arrayContains: "item2",
          stringContains: "substring2",
        },
      ],
    };
    const result = jsonPathStringFilterToPrismaFilter(filter, "propertyName");
    expect(result).toEqual({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      AND: [
        {
          propertyName: {
            path: ["path", "to", "property1"],
            equals: "value1",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            array_contains: "item1",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            string_contains: "substring1",
          },
        },
        {
          propertyName: {
            path: ["path", "to", "property2"],
            equals: "value2",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            array_contains: "item2",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            string_contains: "substring2",
          },
        },
      ],
    });
  });
});
