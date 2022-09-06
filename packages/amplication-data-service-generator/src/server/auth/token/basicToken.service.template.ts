/* eslint-disable import/no-unresolved */
import { Injectable } from "@nestjs/common";
//@ts-ignore
import { INVALID_PASSWORD_ERROR, INVALID_USERNAME_ERROR } from "../constants";
//@ts-ignore
import { ITokenService, ITokenPayload } from "../ITokenService";
/**
 * TokenServiceBase is a basic http implementation of ITokenService
 */
@Injectable()
export class TokenServiceBase implements ITokenService {
  /**
   *
   * @param id
   * @param username
   * @param password
   * @returns a base64 string of the username and password
   */
  createToken({ id, username, password }: ITokenPayload): Promise<string> {
    if (!username) return Promise.reject(INVALID_USERNAME_ERROR);
    if (!password) return Promise.reject(INVALID_PASSWORD_ERROR);
    return Promise.resolve(
      Buffer.from(`${id}:${username}:${password}`).toString("base64")
    );
  }
}
