/* eslint-disable import/no-unresolved */
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
//@ts-ignore
import { INVALID_PASSWORD_ERROR, INVALID_USERNAME_ERROR } from "../constants";
//@ts-ignore
import { ITokenService, ITokenPayload } from "../ITokenService";
/**
 * TokenServiceBase is a jwt bearer implementation of ITokenService
 */
@Injectable()
export class TokenServiceBase implements ITokenService {
  constructor(protected readonly jwtService: JwtService) {}
  /**
   *
   * @param id
   * @param username
   * @param password
   * @returns a jwt token sign with the username
   */
  createToken({ id, username, password }: ITokenPayload): Promise<string> {
    if (!username) return Promise.reject(INVALID_USERNAME_ERROR);
    if (!password) return Promise.reject(INVALID_PASSWORD_ERROR);
    return this.jwtService.signAsync({
      sub: id,
      username,
    });
  }
}
