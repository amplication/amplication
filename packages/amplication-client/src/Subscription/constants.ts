import * as models from "../models";

export const SUBSCRIPTION_STATUS_TO_STYLE: {
  [key in models.EnumSubscriptionStatus]: {
    style: string;
    icon: string;
    text: string;
  };
} = {
  [models.EnumSubscriptionStatus.Active]: {
    style: "positive",
    icon: "check_circle",
    text: "Active",
  },
  [models.EnumSubscriptionStatus.Deleted]: {
    style: "negative",
    icon: "alert_circle",
    text: "Deleted",
  },
  [models.EnumSubscriptionStatus.PastDue]: {
    style: "warning",
    icon: "info_circle",
    text: "Past Due",
  },
  [models.EnumSubscriptionStatus.Paused]: {
    style: "warning",
    icon: "info_circle",
    text: "Paused",
  },
  [models.EnumSubscriptionStatus.Trailing]: {
    style: "positive",
    icon: "check_circle",
    text: "In Trial",
  },
};
