describe("ui-design-system: Label component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=label"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
