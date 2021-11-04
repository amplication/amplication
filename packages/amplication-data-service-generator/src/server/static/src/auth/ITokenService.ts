export interface ITokenService {
  createToken: (username: string, password: string) => Promise<string>;
}
