import * as models from "../models";
import { useCallback } from "react";
import { AnalyticsEventNames } from "../util/analytics-events.types";

export interface SettingsHookParams {
  trackEvent: (event: { eventName: string; [key: string]: any }) => void;
  resourceId: string | undefined;
  updateResourceSettings: any;
  refetch: () => void;
}

const SERVICE_CONFIG_FORM_SCHEMA = {
  properties: {
    serverSettings: {
      properties: {
        generateGraphQL: {
          type: "boolean",
        },
        generateRestApi: {
          type: "boolean",
        },
        serverPath: {
          type: "string",
        },
      },
      required: ["generateGraphQL", "generateRestApi"],
    },
    adminUISettings: {
      properties: {
        generateAdminUI: {
          type: "boolean",
        },
        adminUIPath: {
          type: "string",
        },
      },
      required: ["generateAdminUI"],
    },
  },
  required: ["serverSettings", "adminUISettings"],
};

const useSettingsHook = ({
  trackEvent,
  resourceId,
  updateResourceSettings,
  refetch,
}: SettingsHookParams) => {
  const handleSubmit = useCallback(
    async (data: models.ServiceSettings) => {
      const {
        authProvider,
        adminUISettings: { generateAdminUI, adminUIPath },
        serverSettings: { generateRestApi, generateGraphQL, serverPath },
      } = data;

      trackEvent({
        eventName: AnalyticsEventNames.ServiceSettingsUpdate,
      });

      try {
        await updateResourceSettings({
          variables: {
            data: {
              adminUISettings: {
                generateAdminUI,
                adminUIPath: adminUIPath || "",
              },
              authProvider,
              serverSettings: {
                generateRestApi,
                generateGraphQL,
                serverPath: serverPath || "",
              },
            },
            resourceId: resourceId,
          },
        });

        // Fetch the latest data after the form submission
        refetch();
      } catch (error) {
        console.error(error);
      }
    },
    [updateResourceSettings, resourceId, trackEvent, refetch]
  );
  return {
    handleSubmit,
    SERVICE_CONFIG_FORM_SCHEMA,
  };
};

export default useSettingsHook;
