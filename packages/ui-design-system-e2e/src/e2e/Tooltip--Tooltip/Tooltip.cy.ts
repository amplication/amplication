describe("ui-design-system: Tooltip component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=tooltip"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
