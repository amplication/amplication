describe("ui-design-system: FullScreenLoader component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=fullscreenloader"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
