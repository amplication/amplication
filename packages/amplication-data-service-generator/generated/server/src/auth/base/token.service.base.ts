import { Injectable } from "@nestjs/common";
import { INVALID_PASSWORD_ERROR, INVALID_USERNAME_ERROR } from "../constants";
import { ITokenService, ITokenPayload } from "../ITokenService";
/**
 * TokenServiceBase is a basic http implementation of ITokenService
 */
@Injectable()
export class TokenServiceBase implements ITokenService {
  /**
   *
   * @object { username: String, password: String }
   * @returns a base64 string of the username and password
   */
  createToken({ username, password }: ITokenPayload): Promise<string> {
    if (!username) return Promise.reject(INVALID_USERNAME_ERROR);
    if (!password) return Promise.reject(INVALID_PASSWORD_ERROR);
    return Promise.resolve(
      Buffer.from(`${username}:${password}`).toString("base64")
    );
  }
}
