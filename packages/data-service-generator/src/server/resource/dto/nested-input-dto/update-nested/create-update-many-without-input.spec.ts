import { createUpdateManyWithoutInputID } from ".";

describe("Testing the id creation of the createUpdateMany", () => {
  const pluralEntityName = "Posts";
  const nestedEntityName = "Tag";
  test("Testing the posts and tag example", () => {
    expect(
      createUpdateManyWithoutInputID(pluralEntityName, nestedEntityName).name
    ).toBe(`${nestedEntityName}UpdateManyWithout${pluralEntityName}Input`);
  });
});
