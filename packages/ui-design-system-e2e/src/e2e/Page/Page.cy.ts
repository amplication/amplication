describe("ui-design-system: Page component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=page"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
