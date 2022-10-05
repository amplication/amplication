import * as reactTracking from "react-tracking";
import { REACT_APP_AMPLITUDE_API_KEY } from "../env";

export interface Event {
  eventName: string;
  [key: string]: unknown;
}

const MISSING_EVENT_NAME = "MISSING_EVENT_NAME";
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
  _hsq.push([
    "trackCustomBehavioralEvent",
    { name: eventName, properties: rest },
  ]);
  if (REACT_APP_AMPLITUDE_API_KEY) {
    //@ts-ignore
    const analytics = window.analytics;
    analytics.track(eventName || MISSING_EVENT_NAME, rest);
  }
}

export function init() {
  if (REACT_APP_AMPLITUDE_API_KEY) {
    //@ts-ignore
    const analytics = window.analytics;
    analytics.load(REACT_APP_AMPLITUDE_API_KEY);
    dispatch({
      eventName: "startAppSession",
    });
  }
}

type EventProps = {
  [key: string]: unknown;
};

export function identity(userId: string, props: EventProps) {
  _hsq.push(["identify", { id: userId, ...props }]);
  if (REACT_APP_AMPLITUDE_API_KEY) {
    //@ts-ignore
    const analytics = window.analytics;
    analytics.identify(userId, props);
  }
}

export function page(name?: string, props?: EventProps) {
  _hsq.push(["trackPageView"]);
  if (REACT_APP_AMPLITUDE_API_KEY) {
    //@ts-ignore
    const analytics = window.analytics;
    analytics.page(name, props);
  }
}
