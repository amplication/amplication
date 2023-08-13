describe("ui-design-system: LimitationDialog component", () => {
  beforeEach(() =>
    cy.visit("/iframe.html?args=isOpen:true&id=limitationdialog")
  );

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
