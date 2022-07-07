import * as models from "../models";
import { useCallback } from "react";

interface SettingsHookParams {
  trackEvent: (event: { eventName: string; [key: string]: any }) => void;
  applicationId: string;
  updateAppSettings: any;
}

const FORM_SCHEMA = {
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
  applicationId,
  updateAppSettings,
}: SettingsHookParams) => {
  const handleSubmit = useCallback(
    (data: models.AppSettings) => {
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
        eventName: "updateAppSettings",
      });
      updateAppSettings({
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
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [updateAppSettings, applicationId, trackEvent]
  );

  return {
    handleSubmit,
    FORM_SCHEMA,
  };
};

export default useSettingsHook;
