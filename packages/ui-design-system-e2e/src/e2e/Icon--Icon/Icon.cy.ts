describe("ui-design-system: Icon component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=icon"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
