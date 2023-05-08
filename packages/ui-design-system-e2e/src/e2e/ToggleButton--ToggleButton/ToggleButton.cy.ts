describe("ui-design-system: ToggleButton component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=togglebutton"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
