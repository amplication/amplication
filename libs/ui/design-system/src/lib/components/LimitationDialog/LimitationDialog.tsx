import React from "react";
import { Dialog, Props as DialogProps } from "../Dialog/Dialog";
import { Button, EnumButtonStyle } from "../Button/Button";
import "./LimitationDialog.scss";
import { Icon } from "../Icon/Icon";

const CLASS_NAME = "limitation-dialog";

export type Props = DialogProps & {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onDismiss: () => void;
};

export const LimitationDialog = ({
  isOpen,
  message,
  onConfirm,
  onDismiss,
}: Props) => {
  return (
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
  );
};
