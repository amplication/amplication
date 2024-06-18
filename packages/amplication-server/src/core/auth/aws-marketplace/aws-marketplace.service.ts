import { Inject, Injectable } from "@nestjs/common";
import {
  MarketplaceMeteringClient,
  ResolveCustomerCommand,
  ResolveCustomerResult,
} from "@aws-sdk/client-marketplace-metering";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Request, Response } from "express";
import { Env } from "../../../env";
import { PrismaService } from "../../../prisma";
import { ConfigService } from "@nestjs/config";
import { stringifyUrl } from "query-string";
import { URL } from "url";
import { registrationHtmlBody } from "./registration-page";
import { AWS_MARKETPLACE_INTEGRATION_CALLBACK_PATH } from "./constant";
import * as cookie from "cookie";
import { AuthService } from "../auth.service";

@Injectable()
export class AwsMarketplaceService {
  private awsMeteringClient: MarketplaceMeteringClient;
  private host: string;

  private cookieName = "mpid";

  constructor(
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger,
    configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService
  ) {
    const config = {
      credentials: {
        accountId: configService.get(
          Env.AWS_MARKETPLACE_INTEGRATION_ACCOUNT_ID
        ),
        accessKeyId: configService.get(Env.AWS_MARKETPLACE_INTEGRATION_KEY),
        secretAccessKey: configService.get(
          Env.AWS_MARKETPLACE_INTEGRATION_SECRET
        ),
      },
      region: "us-east-1",
    };

    this.awsMeteringClient = new MarketplaceMeteringClient(config);

    this.host = configService.get(Env.HOST);
  }

  private async resolveCustomer(token: string): Promise<ResolveCustomerResult> {
    this.logger.debug(`Resolve aws marketplace customer`, { token });

    const command = new ResolveCustomerCommand({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      RegistrationToken: token,
    });

    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const result = await this.awsMeteringClient.send(command);

      this.logger.debug(`Resolve aws marketplace customer response`, {
        ...result,
      });
      return result;
    } catch (error) {
      this.logger.error(`Failed to resolve aws marketplace customer`, error, {
        token,
      });
      throw error;
    }
  }

  async handleAwsMarketplaceRequest(
    request: Request,
    response: Response
  ): Promise<string> {
    const awsToken = request.body["x-amzn-marketplace-token"];

    const url = stringifyUrl({
      url: new URL(
        AWS_MARKETPLACE_INTEGRATION_CALLBACK_PATH,
        this.host
      ).toString(),
    });

    const clientDomain = new URL(url).hostname;
    const cookieDomainParts = clientDomain.split(".");
    const cookieDomain = cookieDomainParts
      .slice(Math.max(cookieDomainParts.length - 2, 0))
      .join(".");
    response.cookie(this.cookieName, awsToken, {
      domain: cookieDomain,
      secure: true,
      httpOnly: true,
    });

    return registrationHtmlBody(url);
  }

  async handleAwsMarketplaceRegistration(
    request: Request,
    response: Response
  ): Promise<string> {
    try {
      const contactEmail = request.body["contactEmail"];

      const reqCookies = cookie.parse(request.headers.cookie);

      const awsToken = reqCookies[this.cookieName];
      const customer = await this.resolveCustomer(awsToken);

      const clientDomain = new URL(this.host).hostname;
      const cookieDomainParts = clientDomain.split(".");
      const cookieDomain = cookieDomainParts
        .slice(Math.max(cookieDomainParts.length - 2, 0))
        .join(".");

      response.cookie(this.cookieName, awsToken, {
        domain: cookieDomain,
        secure: true,
        httpOnly: true,
        expires: new Date(),
      });

      const isRegistrationSuccessful =
        await this.authService.signupWithBusinessEmail({
          data: {
            email: contactEmail,
          },
        });

      if (!isRegistrationSuccessful) {
        return `Failed to register. Please contact Amplication support and quote: ${customer.CustomerIdentifier} ${customer.ProductCode}`;
      }

      await this.prismaService.awsMarketplaceIntegration.upsert({
        create: {
          email: contactEmail,
          awsAccountId: customer.CustomerAWSAccountId,
          customerIdentifier: customer.CustomerIdentifier,
          productCode: customer.ProductCode,
        },
        update: {
          email: contactEmail,
          awsAccountId: customer.CustomerAWSAccountId,
          customerIdentifier: customer.CustomerIdentifier,
          productCode: customer.ProductCode,
        },
        where: {
          customerIdentifier: customer.CustomerIdentifier,
        },
      });

      return "Signup successful!<br>Please check your inbox to complete registration and set your password.";
    } catch (error) {
      this.logger.error(
        `Failed to register an AWS Marketplace purchase`,
        error
      );
      return "Failed to register. Please contact Amplication support";
    }
  }
}
