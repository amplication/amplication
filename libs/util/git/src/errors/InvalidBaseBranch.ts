export class InvalidBaseBranch extends Error {
  constructor(branchName: string) {
    super(
      `Cannot find base branch '${branchName}'. Make sure the branch exist and try again `
    );
  }
}
