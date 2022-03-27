import os from 'os';
import fetch from 'node-fetch';
import { PackageJsonHelper } from './packageJsonHelper';
import { v4 as uuid } from 'uuid';


const getOSVersion = () =>
    os['version'] instanceof Function ? os['version']() : 'UNKNOWN';

const POSTHOG_ID="phc_XYKT2bD5pjwUAOphl3BBxQnqGxTDPGTvu2BnG4tSeSF";
const NODE_VERSION = process.version;
const OS_NAME = os.platform();
const OS_VERSION = getOSVersion();
const HOST_NAME = os.hostname();
const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const HEADERS = {};
HEADERS['Content-Type'] = 'application/json';

export const sendServerLoadEvent = (): void => {
  void getValuesFromPackageJson().then(value => {
    const { runtimeId, appName, appVersion } = value;
    const data = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      api_key: POSTHOG_ID,
      event: 'server-load-event',
      properties: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        distinct_id: runtimeId,
        appName: appName,
        appVersion: appVersion,
        nodeVersion: NODE_VERSION,
        osName: OS_NAME,
        osVersion: OS_VERSION,
        hostName: HOST_NAME,
        timezone: TIMEZONE
      },
      timestamp: new Date()
    };

    console.dir(data);
    void fetch('https://app.posthog.com/capture/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: HEADERS
    });
  });
};

const getRuntimeId: (
  packageJsonHelper: PackageJsonHelper
) => Promise<string> = async (
  packageJsonHelper: PackageJsonHelper
): Promise<string> => {
  let runtimeId = await packageJsonHelper.getValue('runtime_id');
  if (!runtimeId) {
    runtimeId = uuid();
    await packageJsonHelper.updateValue('runtime_id', runtimeId);
  }
  return JSON.stringify(runtimeId);
};

const getValuesFromPackageJson: () => Promise<{
  runtimeId: string;
  appName: string;
  appVersion: string;
}> = async (): Promise<{
  runtimeId: string;
  appName: string;
  appVersion: string;
}> => {
  const packageJsonHelper = PackageJsonHelper.getInstance('../package.json');
  const [runtimeId, appName, appVersion] = await Promise.all([
    getRuntimeId(packageJsonHelper),
    packageJsonHelper.getStringValue('name'),
    packageJsonHelper.getStringValue('version')
  ]);

  return {
    runtimeId,
    appName,
    appVersion
  };
};


