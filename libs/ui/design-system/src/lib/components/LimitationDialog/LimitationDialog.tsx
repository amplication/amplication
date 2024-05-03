import React from "react";
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
        {allowBypassLimitation && (
          <Button
            className={`${CLASS_NAME}__upgrade_button`}
            buttonStyle={EnumButtonStyle.Outline}
            onClick={onBypass}
          >
            Later
          </Button>
        )}
      </FlexItem>
    </Dialog>
  );
};
