import * as models from "../models";
import { useCallback } from "react";
import { AnalyticsEventNames } from "../util/analytics-events.types";

export interface SettingsHookParams {
  trackEvent: (event: { eventName: string; [key: string]: any }) => void;
  resourceId: string | undefined;
  updateResourceSettings: any;
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
}: SettingsHookParams) => {
  const handleSubmit = useCallback(
    (data: models.ServiceSettings) => {
      const {
        authProvider,
        authEntityName,
        adminUISettings: { generateAdminUI, adminUIPath },
        serverSettings: { generateRestApi, generateGraphQL, serverPath },
      } = data;
      trackEvent({
        eventName: AnalyticsEventNames.ServiceSettingsUpdate,
      });
      updateResourceSettings({
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
            authEntityName,
          },
          resourceId,
        },
      }).catch(console.error);
    },
    [updateResourceSettings, resourceId, trackEvent]
  );

  return {
    handleSubmit,
    SERVICE_CONFIG_FORM_SCHEMA,
  };
};

export default useSettingsHook;
