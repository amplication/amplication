import { EnumButtonStyle } from "@amplication/ui/design-system";
import "./JovuLogo.scss";
import { useAssistantContext } from "./context/AssistantContext";
import { Button } from "../Components/Button";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useCallback } from "react";

const CLASS_NAME = "ask-jovu-button";

type Props = {
  message: string;
  onClick: () => void;
  disabled?: boolean;
  eventOriginLocation: string;
};

const CreateWithJovuButton = ({
  message,
  onClick,
  disabled,
  eventOriginLocation,
}: Props) => {
  const { setOpen, sendMessage, processingMessage } = useAssistantContext();

  const handleClick = useCallback(() => {
    sendMessage(message);
    setOpen(true);
    onClick && onClick();
  }, [message, onClick, sendMessage, setOpen]);

  return (
    <Button
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
