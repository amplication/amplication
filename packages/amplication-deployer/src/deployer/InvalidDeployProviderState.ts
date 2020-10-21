export class InvalidDeployProviderState extends Error {
  constructor(tag: string, message: string) {
    super(`Deployer Provider (tag: ${tag}): "${message}" `);
  }
}
