describe("ui-design-system: Modal component", () => {
  beforeEach(() => cy.visit("/iframe.html?args=open:true&id=modal--primary"));

  it("should render the component", () => {
    cy.get('[role="presentation"]').should("not.be.empty");
  });
});
