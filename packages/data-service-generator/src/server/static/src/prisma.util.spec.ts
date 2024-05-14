import {
  isRecordNotFoundError,
  PRISMA_QUERY_INTERPRETATION_ERROR,
} from "./prisma.util";

describe("isRecordNotFoundError", () => {
  test("returns true for record not found error", () => {
    expect(
      isRecordNotFoundError(
        Object.assign(
          new Error(`Error occurred during query execution:
        InterpretationError("Error for binding '0': RecordNotFound("Record to update not found.")")`),
          {
            code: PRISMA_QUERY_INTERPRETATION_ERROR,
          }
        )
      )
    ).toBe(true);
  });
  test("returns false for any other error", () => {
    expect(isRecordNotFoundError(new Error())).toBe(false);
  });
});
