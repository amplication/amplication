export class NoCommitOnBranch extends Error {
  constructor(branchName: string) {
    super(`No commit on branch ${branchName}`);
  }
}
