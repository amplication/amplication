import * as reactTracking from "react-tracking";
import amplitude from "amplitude-js";
import { REACT_APP_AMPLITUDE_API_KEY } from "../env";

export interface Event {
  eventName: string;
  [key: string]: unknown;
}

const MISSING_EVENT_NAME = "MISSING_EVENT_NAME";

export const track: reactTracking.Track<Event> = reactTracking.track;

export const useTracking: () => Omit<
  reactTracking.TrackingProp<Event>,
  "trackEvent"
> & {
  trackEvent: (event: Event) => void;
} = reactTracking.useTracking;

export function dispatch(event: Partial<Event>) {
  if (REACT_APP_AMPLITUDE_API_KEY) {
    const { eventName, ...rest } = event;
    amplitude.getInstance().logEvent(eventName || MISSING_EVENT_NAME, rest);
  }
}

export function init() {
  if (REACT_APP_AMPLITUDE_API_KEY) {
    amplitude.getInstance().init(REACT_APP_AMPLITUDE_API_KEY, undefined, {
      saveParamsReferrerOncePerSession: false,
      includeReferrer: true,
      includeUtm: true,
      includeGclid: true,
    });
  }
}

export function setUserId(userId: string) {
  if (REACT_APP_AMPLITUDE_API_KEY) {
    amplitude.getInstance().setUserId(userId);
  }
}

type IdentitySetProps = {
  key: string;
  value: boolean | number | string | any[] | object;
};

export function identifySet({ key, value }: IdentitySetProps) {
  if (REACT_APP_AMPLITUDE_API_KEY) {
    const identify = new amplitude.Identify().set(key, value);
    amplitude.getInstance().identify(identify);
  }
}

export function identifySetOnce({ key, value }: IdentitySetProps) {
  if (REACT_APP_AMPLITUDE_API_KEY) {
    const identify = new amplitude.Identify().setOnce(key, value);
    amplitude.getInstance().identify(identify);
  }
}

type IdentityAddProps = {
  key: string;
  value: number | string;
};

export function identifyAdd({ key, value }: IdentityAddProps) {
  if (REACT_APP_AMPLITUDE_API_KEY) {
    const identify = new amplitude.Identify().add(key, value);
    amplitude.getInstance().identify(identify);
  }
}
