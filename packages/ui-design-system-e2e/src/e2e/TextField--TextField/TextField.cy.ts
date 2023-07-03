describe("ui-design-system: TextField component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=textfield"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
