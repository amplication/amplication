import React from "react";
import { EnumSubscriptionPlan } from "@amplication/code-gen-types/models";
import { EnumContentAlign, FlexItem } from "../FlexItem/FlexItem";
import { Dialog, Props as DialogProps } from "../Dialog/Dialog";
import { Button, EnumButtonStyle } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import "./LimitationDialog.scss";
import classNames from "classnames";

const CLASS_NAME = "limitation-dialog";

export type Props = DialogProps & {
  isOpen: boolean;
  message: string;
  subscriptionPlan: EnumSubscriptionPlan;
  allowBypassLimitation?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  onBypass: () => void;
};

export const LimitationDialog = ({
  isOpen,
  message,
  allowBypassLimitation,
  onConfirm,
  onBypass,
  onDismiss,
}: Props) => {
  return (
    (allowBypassLimitation && (
      <Dialog
        title=""
        className={CLASS_NAME}
        isOpen={isOpen}
        onDismiss={onDismiss}
      >
        <div className={`${CLASS_NAME}__message`}>
          <div
            className={classNames(
              `${CLASS_NAME}__message__header`,
              `${CLASS_NAME}-allow_bypass_limitation`
            )}
          >
            {message}
          </div>
          <div
            className={classNames(
              `${CLASS_NAME}__message__passed_limits_description`,
              `${CLASS_NAME}-allow_bypass_limitation`
            )}
          >
            Please contact us to upgrade
          </div>
        </div>

        <FlexItem contentAlign={EnumContentAlign.Center}>
          <Button
            className={`${CLASS_NAME}__upgrade_button`}
            buttonStyle={EnumButtonStyle.Primary}
            onClick={onConfirm}
          >
            Upgrade
          </Button>
          <Button
            className={`${CLASS_NAME}__upgrade_button`}
            buttonStyle={EnumButtonStyle.Outline}
            onClick={onBypass}
          >
            Later
          </Button>
        </FlexItem>
      </Dialog>
    )) || (
      <Dialog
        title=""
        className={CLASS_NAME}
        isOpen={isOpen}
        onDismiss={onDismiss}
      >
        <div className={`${CLASS_NAME}__message`}>
          <div className={`${CLASS_NAME}__message__header`}>
            We are happy to see your project grow!
          </div>
          <div className={`${CLASS_NAME}__message__passed_limits_description`}>
            You passed the workspace plan limits
          </div>
          <div className={`${CLASS_NAME}__message__passed_limits_details`}>
            {message}
          </div>
          <div className={`${CLASS_NAME}__message__keep_building`}>
            Keep building without limitations by upgrading your workspace plan
          </div>
        </div>
        <Button
          className={`${CLASS_NAME}__upgrade_button`}
          buttonStyle={EnumButtonStyle.Primary}
          onClick={onConfirm}
        >
          <Icon icon="gift" />
          &nbsp; Limited Time Offer: 2 Months Free Pro Plan!
        </Button>
      </Dialog>
    )
  );
};
