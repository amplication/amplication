describe("ui-design-system: SearchField component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=searchfield"));

  it("should render/hydrate the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
