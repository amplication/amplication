import * as reactTracking from "react-tracking";
import { REACT_APP_AMPLITUDE_API_KEY } from "../env";
import { AnalyticsEventNames } from "./analytics-events.types";
import { version } from "../util/version";

export interface Event {
  eventName: AnalyticsEventNames;
  [key: string]: unknown;
}

const ANALYTICS_SESSION_ID_KEY = "analytics_session_id";
export const ANALYTICS_SESSION_ID_HEADER_KEY = "analytics-session-id";

const MISSING_EVENT_NAME = "MISSING_EVENT_NAME";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const _hsq = (window._hsq = window._hsq || []);

export const track: reactTracking.Track<Event> = reactTracking.track;

export const useTracking: () => Omit<
  reactTracking.TrackingProp<Event>,
  "trackEvent"
> & {
  trackEvent: (event: Event) => void;
} = reactTracking.useTracking;

export function dispatch(event: Partial<Event>) {
  const { eventName, ...rest } = event;
  const versionObj = version ? { version } : {};
  _hsq.push([
    "trackCustomBehavioralEvent",
    { name: eventName, properties: { ...versionObj, ...rest } },
  ]);
  if (REACT_APP_AMPLITUDE_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const analytics = window.analytics;
    analytics.track(eventName || MISSING_EVENT_NAME, {
      ...versionObj,
      ...rest,
    });
  }
}

export function init() {
  if (REACT_APP_AMPLITUDE_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const analytics = window.analytics;
    analytics.load(REACT_APP_AMPLITUDE_API_KEY);
    dispatch({
      eventName: AnalyticsEventNames.AppSessionStart,
    });
  }
}

type EventProps = {
  [key: string]: unknown;
};

export function identity(userId: string, props: EventProps) {
  _hsq.push(["identify", { id: userId, ...props }]);
  if (REACT_APP_AMPLITUDE_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const analytics = window.analytics;
    analytics.identify(userId, props);
  }
}

export function page(name?: string, props?: EventProps) {
  _hsq.push(["trackPageView"]);
  if (REACT_APP_AMPLITUDE_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const analytics = window.analytics;
    analytics.page(name, props);
  }
}

export function getSessionId(): string | null {
  return localStorage.getItem(ANALYTICS_SESSION_ID_KEY);
}
