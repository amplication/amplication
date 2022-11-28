declare class ID_TYPE {}

export interface ITokenPayload {
  id: ID_TYPE;
  username: string;
  password: string;
}

export interface ITokenService {
  createToken: ({ id, username, password }: ITokenPayload) => Promise<string>;
}
