describe("ui-design-system: Button component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=button"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
