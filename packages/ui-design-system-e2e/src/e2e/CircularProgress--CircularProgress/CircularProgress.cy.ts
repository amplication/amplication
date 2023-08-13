describe("ui-design-system: CircularProgress component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=circularprogress"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
