export interface ITokenPayload {
  id: string | number;
  username: string;
  password: string;
}

export interface ITokenService {
  createToken: ({ id, username, password }: ITokenPayload) => Promise<string>;
}
