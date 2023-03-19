describe("ui-design-system: TextInput component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=textinput"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
