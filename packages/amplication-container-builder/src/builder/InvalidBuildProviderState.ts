export class InvalidBuildProviderState extends Error {
  constructor(tag: string, message: string) {
    super(`Container Build Provider (tag: ${tag}): "${message}" `);
  }
}
