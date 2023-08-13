describe("ui-design-system: Snackbar component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=snackbar"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
