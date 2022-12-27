import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from "@amplication/nest-logger-module";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stigg, {
  MeteredEntitlement,
  NumericEntitlement,
} from "@stigg/node-server-sdk";
import { Env } from "../../env";

export enum FeatureType {
  Services = "feature-services",
  TeamMembers = "feature-team-members",
  EntitiesPerService = "feature-entities-per-service",
  ServicesWithManyEntities = "feature-services-wth-many-entities",
  CodeGenerationBuilds = "feature-code-generation-builds",
  CodePushToGit = "feature-code-push-to-git",
}

@Injectable()
export class BillingService {
  private readonly stiggClient: Stigg;

  constructor(
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger,
    configService: ConfigService
  ) {
    const stiggApiKey = configService.get(Env.BILLING_API_KEY);
    this.stiggClient = Stigg.initialize({ apiKey: stiggApiKey });
  }

  async getStiggClient() {
    try {
      await this.stiggClient.waitForInitialization();
      return this.stiggClient;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async reportUsage(
    workspaceId: string,
    feature: FeatureType,
    value = 1
  ): Promise<void> {
    const stiggClient = await this.getStiggClient();
    await stiggClient.reportUsage({
      customerId: workspaceId,
      featureId: feature,
      value: value,
    });
  }

  async getMeteredEntitlement(
    workspaceId: string,
    feature: FeatureType
  ): Promise<MeteredEntitlement> {
    const stiggClient = await this.getStiggClient();
    return await stiggClient.getMeteredEntitlement({
      customerId: workspaceId,
      featureId: feature,
    });
  }

  async getNumericEntitlement(
    workspaceId: string,
    feature: FeatureType
  ): Promise<NumericEntitlement> {
    const stiggClient = await this.getStiggClient();
    return await stiggClient.getNumericEntitlement({
      customerId: workspaceId,
      featureId: feature,
    });
  }
}
