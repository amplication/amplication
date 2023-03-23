describe("ui-design-system: CircleIcon component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=circleicon"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
