import os from "os";
import fetch from "node-fetch";
import fs from "fs";

//TODO: Move to shared util
const getVersionFromPackageJson = ():Promise<string> => {
    return new Promise((resolve, _) => {
        fs.readFile("../package.json", ((err: NodeJS.ErrnoException | null, data: Buffer) => {
            try {
                resolve(JSON.parse(data.toString()).version)
            } catch (_) {
                resolve("0.0.0")
            }
        }));
    })
}

//TODO: Move to shared util
const convertToBase64 = (data:string) => Buffer.from(data).toString('base64');

const getOSVersion = () => os['version'] instanceof Function ? os['version']() : "UNKNOWN";


const NOTIFIER_ID =  (process.env.NOTIFICATIONS_ID || "");
const NOTIFIER_SERVER_ID =  (process.env.NOTIFICATIONS_SERVER_ID || "DEFAULT-SERVER-ID");
const NODE_VERSION = process.version;
const OS_NAME = os.platform();
const OS_VERSION = getOSVersion()
const HOST_NAME = os.hostname();
const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone



const HEADERS = {}
HEADERS['Content-Type'] = 'application/json';
HEADERS['Authorization'] = `Basic ${convertToBase64(NOTIFIER_ID)}`;


export const serverLoadNotification = async ():Promise<void> => {
    const APP_VERSION = await getVersionFromPackageJson()
    const data = {
        anonymousId: NOTIFIER_SERVER_ID,
        event: "server-load",
        context: {
            app: {
                name: "@amplication/server",
                version: APP_VERSION,
            },
            library: {
                name: "node",
                version: NODE_VERSION
            },
            os: {
                name: OS_NAME,
                version: OS_VERSION,
            },
            properties: {
                hostname: HOST_NAME
            },
            timezone: TIMEZONE,
        },
        timestamp: new Date(),
    }

    void fetch("https://api.segment.io/v1/track", {
        method: "POST",
        body: JSON.stringify(data),
        headers: HEADERS
    })
}