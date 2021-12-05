import { CreateGitFormSchema } from "./CreateGitFormSchema";

describe("Testing the CreateGitFormSchema", () => {
  const validObject = { name: "ofek", public: true };
  const UnValidObjectPublic = { name: "ofek", public: 45 };
  const UnValidObjectNameShort = { name: "o", public: true };

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
