import { CreateGitFormSchema } from "./CreateGitFormSchema";

describe("Testing the CreateGitFormSchema", () => {
  const validObject = { name: "ofek", isPublic: true };
  const UnValidObjectPublic = { name: "ofek", isPublic: 45 };
  const UnValidObjectNameShort = { name: "o", isPublic: true };

  it("should pass the validate", () => {
    return expect(CreateGitFormSchema.validate(validObject)).resolves.toBe(
      validObject
    );
  });
  it("should throw error if getting invalid value for isPublic property", async () => {
    return expect(
      CreateGitFormSchema.validate(UnValidObjectPublic)
    ).rejects.toThrowError();
  });
  it("should throw error if receiving a name shorter than 2 characters", () => {
    return expect(
      CreateGitFormSchema.validate(UnValidObjectNameShort)
    ).rejects.toThrowError();
  });
});
