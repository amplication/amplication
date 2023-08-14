describe("ui-design-system: Panel component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=panel"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
