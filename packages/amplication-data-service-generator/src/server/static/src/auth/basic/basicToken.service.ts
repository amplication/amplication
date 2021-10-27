import { Injectable } from "@nestjs/common";
import { INVALID_PASSWORD_ERROR, INVALID_USERNAME_ERROR } from "../constants";
import { ITokenService } from "../ITokenService";

@Injectable()
export class BasicTokenService implements ITokenService {
  createToken(username: string, password: string): Promise<string> {
    if (!username) return Promise.reject(INVALID_USERNAME_ERROR);
    if (!password) return Promise.reject(INVALID_PASSWORD_ERROR);
    return Promise.resolve(
      Buffer.from(`${username}:${password}`).toString("base64")
    );
  }
}
