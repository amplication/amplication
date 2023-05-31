describe("ui-design-system: CircleBadge component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=circlebadge"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
