describe("ui-design-system: LimitationNotification component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=limitationnotification"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
