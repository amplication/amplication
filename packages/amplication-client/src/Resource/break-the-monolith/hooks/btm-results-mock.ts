import { EnumUserActionStatus } from "@amplication/code-gen-types/models";
import { TBreakServiceToMicroservicesResult } from "./useBtmService";

export const TEMP_RESULT: TBreakServiceToMicroservicesResult = {
  finalizeBreakServiceIntoMicroservices: {
    data: {
      microservices: [
        {
          name: "VerificationTokenService",
          functionality: "Manage verification token-related operations",
          tables: [
            {
              originalEntityId: "cls7fyj1v000p2cidcfkl0qy4",
              name: "VerificationToken",
            },
          ],
        },
        {
          name: "SessionService",
          functionality: "Manage session-related operations",
          tables: [
            {
              originalEntityId: "cls7fyj1t000o2cidcgh69mn2",
              name: "Session",
            },
          ],
        },
        {
          name: "ProjectService",
          functionality: "Manage project-related operations",
          tables: [
            {
              originalEntityId: "cls7fyj1r000n2ciddmz93fbr",
              name: "Project",
            },
            {
              originalEntityId: "cls7g1boq0001i3id5xnw115v",
              name: "ProjectUser",
            },
            {
              originalEntityId: "clsefimcu0000olgf0vrgvapo",
              name: "ProjectInvite",
            },
          ],
        },
        {
          name: "OptionService",
          functionality: "Manage option-related operations",
          tables: [
            {
              originalEntityId: "clslx0ljs000qvmc9dos9fuf2",
              name: "Option",
            },
          ],
        },
        {
          name: "FeatureFlagService",
          functionality: "Manage feature flag-related operations",
          tables: [
            {
              originalEntityId: "clslx0ljs000evmc97cjw8jjg",
              name: "FeatureFlag",
            },
            {
              originalEntityId: "clslx0ljr0002vmc98ob58g31",
              name: "FeatureFlagValue",
            },
            {
              originalEntityId: "clslx0ljs000nvmc90v0j401z",
              name: "FeatureFlagHistory",
            },
          ],
        },
        {
          name: "ExampleService",
          functionality: "Manage example-related operations",
          tables: [
            {
              originalEntityId: "clslx0ljs000ovmc9gnfe9fhb",
              name: "Example",
            },
          ],
        },
        {
          name: "EventService",
          functionality: "Manage event-related operations",
          tables: [
            {
              originalEntityId: "clslx0ljs000rvmc9cp3a3mu6",
              name: "Event",
            },
          ],
        },
        {
          name: "EnvironmentService",
          functionality: "Manage environment-related operations",
          tables: [
            {
              originalEntityId: "clslx0ljs0007vmc93uhq0dym",
              name: "Environment",
            },
          ],
        },
        {
          name: "CouponCodeService",
          functionality: "Manage coupon code-related operations",
          tables: [
            {
              originalEntityId: "clslx0ljs000kvmc94ybnghc5",
              name: "CouponCode",
            },
          ],
        },
        {
          name: "ApiRequestService",
          functionality: "Manage API request-related operations",
          tables: [
            {
              originalEntityId: "clslx0ljs000uvmc99uyq2cvp",
              name: "ApiRequest",
            },
            {
              originalEntityId: "clslx0ljr0006vmc9427f0m7t",
              name: "ApiKey",
            },
          ],
        },
        {
          name: "AccountService",
          functionality: "Manage account-related operations",
          tables: [
            {
              originalEntityId: "clslx0ljr0003vmc901j5hu0u",
              name: "Account",
            },
            {
              originalEntityId: "clslx0ljs000svmc9g4ka6rw7",
              name: "User",
            },
          ],
        },
      ],
    },
    status: EnumUserActionStatus.Completed,
    originalResourceId: "clrkslill001qp5ssyert3t34",
  },
};
