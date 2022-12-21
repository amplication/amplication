import { createCreateNestedManyWithoutInputID } from ".";

describe("Testing the id creation of the createCreateMany", () => {
  const pluralEntityName = "Posts";
  const nestedEntityName = "Tag";
  test("Testing the posts and tag example", () => {
    expect(
      createCreateNestedManyWithoutInputID(pluralEntityName, nestedEntityName)
        .name
    ).toBe(
      `${nestedEntityName}CreateNestedManyWithout${pluralEntityName}Input`
    );
  });
});
