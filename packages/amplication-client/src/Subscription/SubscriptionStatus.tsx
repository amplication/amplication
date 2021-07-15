import React from "react";
import { Icon } from "@rmwc/icon";

import * as models from "../models";
import "./SubscriptionStatus.scss";

import { SUBSCRIPTION_STATUS_TO_STYLE } from "./constants";

const CLASS_NAME = "subscription-status";

type Props = {
  status: models.EnumSubscriptionStatus;
};

export const SubscriptionStatus = ({ status }: Props) => {
  const data = SUBSCRIPTION_STATUS_TO_STYLE[status];

  return (
    <span className={`${CLASS_NAME} ${CLASS_NAME}--${data.style}`}>
      <Icon
        icon={{
          size: "xsmall",
          icon: data.icon,
        }}
      />
      {data.text}
    </span>
  );
};
