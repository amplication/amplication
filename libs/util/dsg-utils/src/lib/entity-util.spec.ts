import { prepareEntityPluralName } from "./entity-util";

describe("prepareEntityPluralName", () => {
  it("should return a plural name", () => {
    expect(prepareEntityPluralName("customer")).toEqual("Customers");
  });
  it("should return a plural name with the suffix 'Items'", () => {
    expect(prepareEntityPluralName("aircraft")).toEqual("AircraftItems");
  });
});
