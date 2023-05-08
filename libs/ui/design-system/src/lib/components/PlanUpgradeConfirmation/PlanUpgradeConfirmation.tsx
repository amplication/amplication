import React from "react";
import { Dialog, Props as DialogProps } from "../Dialog/Dialog";
import { Button, EnumButtonStyle } from "../Button/Button";

import Lottie from "lottie-react";
import animationFull from "../../assets/amplication-loader-full.json";

import "./PlanUpgradeConfirmation.scss";

const CLASS_NAME = "plan-upgrade-confirmation";

export type Props = DialogProps & {
  isOpen: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
};

export const PlanUpgradeConfirmation = ({
  isOpen,
  onConfirm,
  onDismiss,
}: Props) => {
  return (
    <Dialog
      title=""
      className={CLASS_NAME}
      isOpen={isOpen}
      onDismiss={onDismiss}
      showCloseButton={false}
    >
      <div className={`${CLASS_NAME}__message`}>
        <div className={`${CLASS_NAME}__message__header`}>
          Your workspace was upgraded
        </div>
        <div className={`${CLASS_NAME}__message__animation`}>
          <Lottie animationData={animationFull} />
        </div>
        <div className={`${CLASS_NAME}__message__description_purchase`}>
          Thank you for your purchase!
        </div>
        <div className={`${CLASS_NAME}__message__description_details`}>
          An email with your order confirmation and order details is on its way
          to you
        </div>
      </div>
      <Button
        className={`${CLASS_NAME}__upgrade_button`}
        buttonStyle={EnumButtonStyle.Primary}
        onClick={onConfirm}
      >
        Back to work
      </Button>
    </Dialog>
  );
};
