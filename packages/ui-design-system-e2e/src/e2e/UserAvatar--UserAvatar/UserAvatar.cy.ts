describe("ui-design-system: UserAvatar component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=useravatar"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
