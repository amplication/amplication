describe("ui-design-system: HorizontalRule component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=horizontalrule"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
