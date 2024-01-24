import { Injectable, Inject } from "@nestjs/common";
import Analytics from "analytics-node";
import { SegmentAnalyticsOptions } from "./segmentAnalytics.interfaces";
import { RequestContext } from "nestjs-request-context";

export enum EnumEventType {
  Signup = "Signup",
  WorkspacePlanUpgradeRequest = "WorkspacePlanUpgradeRequest",
  WorkspacePlanUpgradeCompleted = "WorkspacePlanUpgradeCompleted",
  WorkspacePlanDowngradeRequest = "WorkspacePlanDowngradeRequest",
  CommitCreate = "commit",
  WorkspaceSelected = "selectWorkspace",
  GitHubAuthResourceComplete = "completeAuthResourceWithGitHub",
  ServiceWizardServiceGenerated = "ServiceWizard_ServiceGenerated",
  SubscriptionLimitPassed = "SubscriptionLimitPassed",
  EntityCreate = "createEntity",
  EntityUpdate = "updateEntity",
  EntityFieldCreate = "createEntityField",
  EntityFieldUpdate = "updateEntityField",
  EntityFieldFromImportPrismaSchemaCreate = "EntityFieldFromImportPrismaSchemaCreate",
  PluginInstall = "installPlugin",
  PluginUpdate = "updatePlugin",
  DemoRepoCreate = "CreateDemoRepo",
  InvitationAcceptance = "invitationAcceptance",

  //Import Prisma Schema
  ImportPrismaSchemaStart = "importPrismaSchemaStart",
  ImportPrismaSchemaError = "importPrismaSchemaError",
  ImportPrismaSchemaCompleted = "importPrismaSchemaCompleted",

  GitSyncError = "gitSyncError",
  CodeGenerationError = "codeGenerationError",

  CodeGeneratorVersionUpdate = "codeGeneratorVersionUpdate",

  RedeemCoupon = "RedeemCoupon",
}

export type IdentifyData = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};

export type TrackData = {
  userId: string;
  event: EnumEventType;
  properties?:
    | {
        [key: string]: unknown;
      }
    | undefined;
  context?: {
    traits?: IdentifyData;
    amplication?: {
      analyticsSessionId?: string;
    };
  };
};

@Injectable()
export class SegmentAnalyticsService {
  private analytics: Analytics;

  constructor(
    @Inject("SEGMENT_ANALYTICS_OPTIONS")
    private options: SegmentAnalyticsOptions
  ) {
    if (options && options.segmentWriteKey && options.segmentWriteKey.length) {
      this.analytics = new Analytics(this.options.segmentWriteKey);
    }
  }

  private parseValidUnixTimestampOrUndefined(
    value: string
  ): string | undefined {
    const timestamp = parseInt(value, 10);

    // Check if the value is an integer and within a valid range for Unix timestamps
    if (!isNaN(timestamp) && Number.isInteger(timestamp) && timestamp >= 0) {
      return value;
    } else {
      return undefined;
    }
  }

  public async identify(data: IdentifyData): Promise<void> {
    if (!this.analytics) return;

    const { userId, ...rest } = data;

    this.analytics.identify({
      userId: userId,
      traits: rest,
    });
  }

  public async track(data: TrackData): Promise<void> {
    if (!this.analytics) return;

    const req = RequestContext?.currentContext?.req;
    const analyticsSessionId = this.parseValidUnixTimestampOrUndefined(
      req?.analyticsSessionId
    );

    this.analytics.track({
      ...data,
      properties: {
        ...data.properties,
        source: "amplication-server",
      },
      context: {
        ...data.context,
        amplication: {
          analyticsSessionId: analyticsSessionId,
        },
      },
    } as TrackData);
  }
}
