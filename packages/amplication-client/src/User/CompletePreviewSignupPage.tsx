import { Modal } from "@amplication/ui/design-system";
import { CompletePreviewSignup } from "./CompletePreviewSignup";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";

const CompletePreviewSignupPage = () => {
  const history = useHistory();

  const toggleIsOpen = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <>
      <Modal open fullScreen showCloseButton onCloseEvent={toggleIsOpen}>
        <CompletePreviewSignup onConfirm={toggleIsOpen} />
      </Modal>
    </>
  );
};

export default CompletePreviewSignupPage;
