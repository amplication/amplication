import { AwsRum, AwsRumConfig } from "aws-rum-web";

import {
  REACT_APP_RUM_ROLE_ID,
  REACT_APP_RUM_POOL_ID,
  REACT_APP_RUM_APP_ID,
  REACT_APP_RUM_SAMPLE_RATE,
} from "../env";

let awsRum: AwsRum | null = null;

if (REACT_APP_RUM_APP_ID) {
  try {
    const config: AwsRumConfig = {
      sessionSampleRate: Number(REACT_APP_RUM_SAMPLE_RATE) ?? 1,
      guestRoleArn: REACT_APP_RUM_ROLE_ID,
      identityPoolId: REACT_APP_RUM_POOL_ID,
      endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
      telemetries: ["performance", "errors", "http"],
      allowCookies: true,
      enableXRay: false,
      disableAutoPageView: true,
      sessionEventLimit: 0,
    };
    const APPLICATION_VERSION = "1.0.0";
    const APPLICATION_REGION = "us-east-1";

    awsRum = new AwsRum(
      REACT_APP_RUM_APP_ID,
      APPLICATION_VERSION,
      APPLICATION_REGION,
      config
    );
  } catch (error) {
    // Ignore errors thrown during CloudWatch RUM web client initialization
  }

  window.addEventListener("error", (event) => {
    awsRum.recordError(event);
  });
} else {
  awsRum = {
    enable: () => {},
    recordPageView: () => {},
  } as unknown as AwsRum;
}

export { awsRum };
