import { Injectable } from "@nestjs/common";
import { ITokenService } from "../ITokenService";

@Injectable()
export class BasicTokenService implements ITokenService {
  createToken(username: string, password: string): Promise<string> {
    return Promise.resolve(
      Buffer.from(`${username}:${password}`).toString("base64")
    );
  }
}
