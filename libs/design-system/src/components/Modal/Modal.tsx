import React, { useCallback } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Dialog, Fade } from "@mui/material";

interface Props {
  onCloseEvent?: () => void;
  open: boolean;
  fullScreen: boolean;
  css?: string;
  children?: React.ReactNode;
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
}) => {
  const handleClose = useCallback(() => {
    onCloseEvent && onCloseEvent();
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
