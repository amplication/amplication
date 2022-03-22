import os from 'os';
import fetch from 'node-fetch';
import { name as APP_NAME, version as APP_VERSION } from '../../package.json';

//TODO: Move to shared util
const convertToBase64 = (data: string) => Buffer.from(data).toString('base64');

const getOSVersion = () =>
  os['version'] instanceof Function ? os['version']() : 'UNKNOWN';

const NOTIFIER_ID = process.env.NOTIFICATIONS_ID || '';
const NOTIFIER_SERVER_ID =
  process.env.NOTIFICATIONS_SERVER_ID || 'DEFAULT-SERVER-ID';
const NODE_VERSION = process.version;
const OS_NAME = os.platform();
const OS_VERSION = getOSVersion();
const HOST_NAME = os.hostname();
const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const HEADERS = {};
HEADERS['Content-Type'] = 'application/json';
HEADERS['Authorization'] = `Basic ${convertToBase64(NOTIFIER_ID)}`;

export const serverLoadNotification = async (): Promise<void> => {
  const data = {
    anonymousId: NOTIFIER_SERVER_ID,
    event: 'server-load',
    context: {
      app: {
        name: APP_NAME,
        version: APP_VERSION
      },
      library: {
        name: 'node',
        version: NODE_VERSION
      },
      os: {
        name: OS_NAME,
        version: OS_VERSION
      },
      properties: {
        hostname: HOST_NAME
      },
      timezone: TIMEZONE
    },
    timestamp: new Date()
  };

  void fetch('https://api.segment.io/v1/track', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: HEADERS
  });
};
