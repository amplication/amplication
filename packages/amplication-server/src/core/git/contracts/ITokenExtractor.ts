export interface ITokenExtractor {
  getTokenFromDb: (resourceId: string) => Promise<string>;
}
