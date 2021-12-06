export interface ITokenExtractor {
  getTokenFromDb: (appId: string) => Promise<string>;
}
