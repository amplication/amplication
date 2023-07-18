describe("ui-design-system: Toggle component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=toggle"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
