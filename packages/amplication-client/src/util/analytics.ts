import * as reactTracking from "react-tracking";
import amplitude from "amplitude-js";
import { REACT_APP_AMPLITUDE_API_KEY } from "../env";

interface Event {
  eventType: string;
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
    const { eventType, ...rest } = event;
    console.log(REACT_APP_AMPLITUDE_API_KEY, event);
    amplitude.getInstance().logEvent(eventType || MISSING_EVENT_NAME, rest);
  }
}

export function init() {
  if (REACT_APP_AMPLITUDE_API_KEY) {
    amplitude.getInstance().init(REACT_APP_AMPLITUDE_API_KEY);
  }
}
