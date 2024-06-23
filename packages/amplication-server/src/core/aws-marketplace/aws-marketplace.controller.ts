import { Controller, UseInterceptors, Res, Req, Post } from "@nestjs/common";
import { MorganInterceptor } from "nest-morgan";
import { Request, Response } from "express";
import { AwsMarketplaceService } from "./aws-marketplace.service";
import {
  AWS_MARKETPLACE_INTEGRATION_CALLBACK_PATH,
  AWS_MARKETPLACE_INTEGRATION_REQUEST_PATH,
} from "./constant";

@Controller("/")
export class AwsMarketplaceController {
  constructor(private readonly awsMarketplaceService: AwsMarketplaceService) {}

  @UseInterceptors(MorganInterceptor("combined"))
  @Post(AWS_MARKETPLACE_INTEGRATION_REQUEST_PATH)
  async awsMarketplace(@Req() request: Request, @Res() response: Response) {
    const resBody =
      await this.awsMarketplaceService.handleAwsMarketplaceRequest(
        request,
        response
      );
    response.send(resBody);
  }

  @UseInterceptors(MorganInterceptor("combined"))
  @Post(AWS_MARKETPLACE_INTEGRATION_CALLBACK_PATH)
  async awsMarketplaceCallback(
    @Req() request: Request,
    @Res() response: Response
  ) {
    const res =
      await this.awsMarketplaceService.handleAwsMarketplaceRegistration(
        request,
        response
      );
    response.send(res);
  }
}
