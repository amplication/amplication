describe("ui-design-system: ConfirmationDialog component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=confirmationdialog"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
