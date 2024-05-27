import { EnumButtonStyle } from "@amplication/ui/design-system";
import { useCallback } from "react";
import { Button } from "../Components/Button";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import "./JovuLogo.scss";
import { useAssistantContext } from "./context/AssistantContext";

const CLASS_NAME = "ask-jovu-button";

type Props = {
  message: string;
  onCreateWithJovuClicked: () => void;
  disabled?: boolean;
  eventOriginLocation: string;
};

const CreateWithJovuButton = ({
  message,
  onCreateWithJovuClicked,
  disabled,
  eventOriginLocation,
}: Props) => {
  const { setOpen, sendMessage, processingMessage } = useAssistantContext();

  const handleClick = useCallback(() => {
    sendMessage(message);
    setOpen(true);
    onCreateWithJovuClicked && onCreateWithJovuClicked();
  }, [message, onCreateWithJovuClicked, sendMessage, setOpen]);

  return (
    <Button
      type="button"
      disabled={processingMessage || disabled}
      className={CLASS_NAME}
      buttonStyle={EnumButtonStyle.GradientFull}
      icon="ai"
      eventData={{
        eventName: AnalyticsEventNames.AskJovuClick,
        eventOriginLocation,
      }}
      onClick={handleClick}
    >
      Create with Jovu
    </Button>
  );
};

export default CreateWithJovuButton;
