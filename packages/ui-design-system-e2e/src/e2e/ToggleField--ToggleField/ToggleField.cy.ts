describe("ui-design-system: ToggleField component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=togglefield"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
