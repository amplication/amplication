describe("ui-design-system: MultiStateToggle component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=multistatetoggle"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
