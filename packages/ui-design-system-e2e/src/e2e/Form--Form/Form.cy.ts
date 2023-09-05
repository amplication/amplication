describe("ui-design-system: Form component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=form"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
