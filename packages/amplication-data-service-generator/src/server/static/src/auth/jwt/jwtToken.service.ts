import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ITokenService } from "../ITokenService";

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(protected readonly jwtService: JwtService) {}
  createToken(username: string, password: string): Promise<string> {
    return this.jwtService.signAsync({ username });
  }
}
