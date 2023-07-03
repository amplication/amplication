describe("ui-design-system: componentNode component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=componentnode"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
