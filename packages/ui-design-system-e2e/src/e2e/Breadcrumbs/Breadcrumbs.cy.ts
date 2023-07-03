describe("ui-design-system: Breadcrumbs component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=breadcrumbs"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
