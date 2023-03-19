describe("ui-design-system: CodeEditor component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=codeeditor"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
