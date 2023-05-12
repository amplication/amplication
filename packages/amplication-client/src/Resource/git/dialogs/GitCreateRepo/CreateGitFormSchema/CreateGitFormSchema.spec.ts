import { CreateGitFormSchema } from "./CreateGitFormSchema";

describe("Testing the CreateGitFormSchema", () => {
  const validObject = { name: "ofek", isPrivate: true };
  const UnValidObjectPublic = { name: "ofek", isPrivate: 45 };
  const UnValidObjectNameShort = { name: "o", isPrivate: true };

  it("should pass the validate", () => {
    return expect(CreateGitFormSchema.validate(validObject)).resolves.toBe(
      validObject
    );
  });
  it("should throw error if getting un valid public value", async () => {
    return expect(
      CreateGitFormSchema.validate(UnValidObjectPublic)
    ).rejects.toThrowError();
  });
  it("should throw error if getting short name", () => {
    return expect(
      CreateGitFormSchema.validate(UnValidObjectNameShort)
    ).rejects.toThrowError();
  });
});
