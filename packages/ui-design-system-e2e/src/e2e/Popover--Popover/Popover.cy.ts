describe("ui-design-system: Popover component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=popover"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
