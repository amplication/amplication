import React, { ReactNode } from "react";
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
  title?: string;
  subTitle?: string;
  message?: string;
  ctaText?: string;
  graphics?: ReactNode;
};

export const PlanUpgradeConfirmation = ({
  isOpen,
  onConfirm,
  onDismiss,
  title,
  subTitle,
  message,
  ctaText,
  graphics,
}: Props) => {
  const defaultTitle = "Your workspace was upgraded";
  const defaultSubTitle = "Thank you for your purchase!";
  const defaultMessage =
    "An email with your order confirmation and order details is on its way to you";
  const defaultCtaText = "Back to work";

  const defaultGraphics = <Lottie animationData={animationFull} />;

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
          {title || defaultTitle}
        </div>
        <div className={`${CLASS_NAME}__message__animation`}>
          {graphics || defaultGraphics}
        </div>
        <div className={`${CLASS_NAME}__message__description_purchase`}>
          {subTitle || defaultSubTitle}
        </div>
        <div className={`${CLASS_NAME}__message__description_details`}>
          {message || defaultMessage}
        </div>
      </div>
      <Button
        className={`${CLASS_NAME}__upgrade_button`}
        buttonStyle={EnumButtonStyle.Primary}
        onClick={onConfirm}
      >
        {ctaText || defaultCtaText}
      </Button>
    </Dialog>
  );
};
