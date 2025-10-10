import os from "os";
import fetch from "node-fetch";
import { JsonHelper } from "./jsonHelper";
import { v4 as uuid } from "uuid";
import { name as APP_NAME } from "../../../../package.json";
import { version as APP_VERSION } from "../util/version";

const getOSVersion = () =>
  os["version"] instanceof Function ? os["version"]() : "UNKNOWN";

const POSTHOG_ID = "phc_XYKT2bD5pjwUAOphl3BBxQnqGxTDPGTvu2BnG4tSeSF";
const NODE_VERSION = process.version;
const OS_NAME = os.platform();
const OS_VERSION = getOSVersion();
const HOST_NAME = os.hostname();
const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const SERVER_ID_FILE_NAME = "../.server-id";

const HEADERS = {};
HEADERS["Content-Type"] = "application/json";

export const sendServerLoadEvent = (): void => {
  void getServerId().then((runtimeId) => {
    const data = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      api_key: POSTHOG_ID,
      event: "server-load-event",
      properties: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        distinct_id: runtimeId,
        appName: APP_NAME,
        appVersion: APP_VERSION,
        nodeVersion: NODE_VERSION,
        osName: OS_NAME,
        osVersion: OS_VERSION,
        hostName: HOST_NAME,
        timezone: TIMEZONE,
      },
      timestamp: new Date(),
    };

    void fetch("https://app.posthog.com/capture/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: HEADERS,
    });
  });
};

const getServerId: () => Promise<string> = async (): Promise<string> => {
  const RUNTIME_ID = "runtime_id";
  const packageJsonHelper = JsonHelper.getInstance(SERVER_ID_FILE_NAME);
  if (!(await packageJsonHelper.exists())) {
    await packageJsonHelper.updateValue(RUNTIME_ID, uuid());
  }

  return await packageJsonHelper.getStringValue(RUNTIME_ID);
};
