describe("ui-design-system: TreeView component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=treeview"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
