describe("ui-design-system: UserAndTime component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=userandtime"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
