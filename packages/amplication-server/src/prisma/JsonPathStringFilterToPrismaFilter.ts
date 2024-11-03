import { JsonPathStringFilter } from "../dto/JsonPathStringFilter";
import { Prisma } from "./index";

export function jsonPathStringFilterToPrismaFilter(
  filter: JsonPathStringFilter,
  propertyName: string
) {
  if (!filter || !filter.matchAll || filter.matchAll.length === 0) {
    return undefined;
  }

  const { matchAll } = filter;

  const prismaFilter = matchAll.map((item) => {
    const { path, equals, arrayContains, stringContains } = item;

    const prismaFilter: Prisma.JsonFilterBase = {
      path: path.split("."),
      equals,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      array_contains: arrayContains,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      string_contains: stringContains,
    };

    return { [propertyName]: prismaFilter };
  });

  if (prismaFilter.length === 1) {
    return prismaFilter[0];
  }

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    AND: prismaFilter,
  };
}
