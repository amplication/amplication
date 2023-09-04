describe("ui-design-system: TimeSince component", () => {
  beforeEach(() => cy.visit("/iframe.html?id=timesince"));

  it("should render the component", () => {
    cy.get("[id=root]").should("not.be.empty");
  });
});
