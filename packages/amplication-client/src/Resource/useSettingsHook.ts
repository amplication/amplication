import * as models from "../models";
import { useCallback } from "react";

export interface SettingsHookParams {
  trackEvent: (event: { eventName: string; [key: string]: any }) => void;
  resourceId: string;
  updateResourceSettings: any;
}

const SERVICE_CONFIG_FORM_SCHEMA = {
  properties: {
    dbHost: {
      type: "string",
      minLength: 2,
    },
    dbUser: {
      type: "string",
      minLength: 2,
    },
    dbPassword: {
      type: "string",
      minLength: 2,
    },
    dbPort: {
      type: "integer",
      minLength: 4,
      maxLength: 5,
    },
    dbName: {
      type: "string",
    },
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
  required: [
    "dbHost",
    "dbUser",
    "dbPassword",
    "dbPort",
    "serverSettings",
    "adminUISettings",
  ],
};

const useSettingsHook = ({
  trackEvent,
  resourceId,
  updateResourceSettings,
}: SettingsHookParams) => {
  const handleSubmit = useCallback(
    (data: models.ServiceSettings) => {
      const {
        dbHost,
        dbName,
        dbPassword,
        dbPort,
        dbUser,
        authProvider,
        adminUISettings: { generateAdminUI, adminUIPath },
        serverSettings: { generateRestApi, generateGraphQL, serverPath },
      } = data;
      trackEvent({
        eventName: "updateServiceSettings",
      });
      updateResourceSettings({
        variables: {
          data: {
            adminUISettings: {
              generateAdminUI,
              adminUIPath: adminUIPath || "",
            },
            dbHost,
            dbName,
            dbPassword,
            dbPort,
            dbUser,
            authProvider,
            serverSettings: {
              generateRestApi,
              generateGraphQL,
              serverPath: serverPath || "",
            },
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
