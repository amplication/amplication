import { EnumButtonStyle } from "@amplication/ui/design-system";
import "./JovuLogo.scss";
import { useAssistantContext } from "./context/AssistantContext";
import { Button } from "../Components/Button";
import { AnalyticsEventNames } from "../util/analytics-events.types";

const CLASS_NAME = "ask-jovu-button";

const AskJovuButton = () => {
  const { setOpen, open } = useAssistantContext();

  if (open) {
    return null;
  }

  return (
    <Button
      className={CLASS_NAME}
      buttonStyle={EnumButtonStyle.GradientFull}
      icon="ai"
      eventData={{
        eventName: AnalyticsEventNames.AskJovuClick,
      }}
      onClick={() => {
        setOpen(true);
      }}
    >
      Ask Jovu
    </Button>
  );
};

export default AskJovuButton;
