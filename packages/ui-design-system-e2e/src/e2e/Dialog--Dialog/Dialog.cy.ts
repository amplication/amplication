describe("ui-design-system: Dialog component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=dialog"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
