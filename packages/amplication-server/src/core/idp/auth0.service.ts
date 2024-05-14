import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  AuthenticationClient,
  ChangePasswordRequest,
  JSONApiResponse,
  ManagementClient,
  PostPasswordChangeRequest,
  SignUpRequest,
  SignUpResponse,
  TextApiResponse,
} from "auth0";
import { Env } from "../../env";
import { generatePassword } from "../auth/auth-utils";
import { Auth0User } from "./types";

@Injectable()
export class Auth0Service {
  private readonly auth0: AuthenticationClient;
  private readonly auth0Management: ManagementClient;
  private readonly clientId: string;
  private readonly businessEmailDbConnectionName: string;
  private readonly clientDbConnectionId: string;

  constructor(configService: ConfigService) {
    this.clientId = configService.get<string>(Env.AUTH_ISSUER_CLIENT_ID);
    const clientSecret = configService.get<string>(
      Env.AUTH_ISSUER_CLIENT_SECRET
    );
    this.businessEmailDbConnectionName = configService.get<string>(
      Env.AUTH_ISSUER_CLIENT_DB_CONNECTION
    );
    this.clientDbConnectionId = configService.get<string>(
      Env.AUTH_ISSUER_CLIENT_DB_CONNECTION_ID
    );
    this.auth0 = new AuthenticationClient({
      domain: configService.get<string>(Env.AUTH_ISSUER_BASE_URL),
      clientId: this.clientId,
      clientSecret,
    });
    this.auth0Management = new ManagementClient({
      domain: configService.get<string>(Env.AUTH_ISSUER_MANAGEMENT_BASE_URL),
      clientId: this.clientId,
      clientSecret: clientSecret,
    });
  }

  async createUser(email: string): Promise<Auth0User> {
    const data: SignUpRequest = {
      email,
      password: generatePassword(),
      connection: this.businessEmailDbConnectionName,
    };

    const user: JSONApiResponse<SignUpResponse> =
      await this.auth0.database.signUp(data);

    return user;
  }

  async resetUserPassword(email: string): Promise<TextApiResponse> {
    const data: ChangePasswordRequest = {
      email,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: this.clientId,
      connection: this.businessEmailDbConnectionName,
    };

    const changePasswordResponse = await this.auth0.database.changePassword(
      data
    );

    return changePasswordResponse;
  }

  async generateResetUserPasswordLink(email: string): Promise<string> {
    const data: PostPasswordChangeRequest = {
      email,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: this.clientId,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      connection_id: this.clientDbConnectionId,
    };

    const changePasswordResponse =
      await this.auth0Management.tickets.changePassword(data);

    return changePasswordResponse.data.ticket;
  }

  async getUserByEmail(email: string): Promise<boolean> {
    const user = await this.auth0Management.usersByEmail.getByEmail({ email });
    if (!user.data.length) return false;

    return user.data[0].email === email;
  }
}
