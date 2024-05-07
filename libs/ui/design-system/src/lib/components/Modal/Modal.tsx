import React, { useCallback } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Dialog, Fade } from "@mui/material";
import classNames from "classnames";
import { Button, EnumButtonStyle } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import "./Modal.scss";

const CLASS_NAME = "amp-modal";
interface Props {
  onCloseEvent?: () => void;
  open: boolean;
  fullScreen: boolean;
  css?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} in timeout={250} />;
});

export const Modal: React.FC<Props> = ({
  onCloseEvent,
  open,
  fullScreen = false,
  css,
  children,
  showCloseButton = false,
}) => {
  const handleClose = useCallback(() => {
    onCloseEvent && onCloseEvent();
  }, [onCloseEvent]);

  return children ? (
    <Dialog
      className={classNames(CLASS_NAME, css)}
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div className={`${CLASS_NAME}__wrapper`}>
        {showCloseButton && (
          <Button
            buttonStyle={EnumButtonStyle.Text}
            className={`${CLASS_NAME}__close`}
            onClick={handleClose}
          >
            <Icon icon="close" size="xsmall"></Icon>
            Close
          </Button>
        )}
        {children}
      </div>
    </Dialog>
  ) : null;
};
