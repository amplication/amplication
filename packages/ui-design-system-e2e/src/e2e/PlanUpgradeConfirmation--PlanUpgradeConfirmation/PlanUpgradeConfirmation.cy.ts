describe("ui-design-system: PlanUpgradeConfirmation component", () => {
  beforeEach(() =>
    cy.visit("/iframe.html?id=planupgradeconfirmation&args=isOpen:true")
  );

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
