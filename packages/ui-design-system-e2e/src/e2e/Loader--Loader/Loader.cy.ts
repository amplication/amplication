describe("ui-design-system: Loader component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=loader"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
