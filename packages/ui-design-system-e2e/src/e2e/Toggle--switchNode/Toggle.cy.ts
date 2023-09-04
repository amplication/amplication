describe("ui-design-system: switchNode component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=switchnode"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
