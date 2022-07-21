import React, { useCallback } from "react";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";

interface Props {
  onCloseEvent: () => void;
  open: boolean;
  fullScreen: boolean;
  css: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal: React.FC<Props> = ({
  onCloseEvent,
  open,
  fullScreen = false,
  css,
  children,
}) => {
  const handleClose = useCallback(() => {
    onCloseEvent();
  }, [onCloseEvent]);

  return children ? (
    <Dialog
      className={css}
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      {children}
    </Dialog>
  ) : null;
};

export default Modal;
