describe("ui-design-system: TreeItem component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=treeitem"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
