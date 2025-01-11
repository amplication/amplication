import {
  EnumTextColor,
  EnumTextStyle,
  Icon,
  Text,
  Tooltip,
} from "@amplication/ui/design-system";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import jovu from "../assets/jovu-logo.svg";
import "./Assistant.scss";
import AssistantChat from "./AssistantChat";
import { useAssistantContext } from "./context/AssistantContext";

const DIRECTION = "sw";

export const CLASS_NAME = "assistant";

const WIDTH_STATE_DEFAULT = "default";
const WIDTH_STATE_WIDE = "wide";

const WIDTH_STATE_SETTINGS: Record<
  string,
  { icon: string; tooltip: string; nextState: "default" | "wide" }
> = {
  [WIDTH_STATE_DEFAULT]: {
    icon: "chevrons_right",
    tooltip: "Increase Size",
    nextState: WIDTH_STATE_WIDE,
  },
  [WIDTH_STATE_WIDE]: {
    icon: "chevrons_left",
    tooltip: "Restore Size",
    nextState: WIDTH_STATE_DEFAULT,
  },
};

const Assistant = () => {
  const { open, setOpen, widthState, setWidthState, messages } =
    useAssistantContext();

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div
        className={classNames(
          CLASS_NAME,
          { [`${CLASS_NAME}--close`]: !open },
          `${CLASS_NAME}--${widthState}`
        )}
      >
        <div className={`${CLASS_NAME}__header`}>
          <img
            src={jovu}
            alt="jovu"
            width={30}
            height={30}
            style={{ background: "white", borderRadius: "50%" }}
          />
          <Text className={`${CLASS_NAME}__title`} textStyle={EnumTextStyle.H4}>
            Jovu
          </Text>
          <Tooltip
            aria-label={WIDTH_STATE_SETTINGS[widthState].tooltip}
            direction={DIRECTION}
            noDelay
          >
            <Button
              buttonStyle={EnumButtonStyle.Text}
              onClick={() => {
                setWidthState(WIDTH_STATE_SETTINGS[widthState].nextState);
              }}
            >
              <Icon
                icon={WIDTH_STATE_SETTINGS[widthState].icon}
                size="small"
              ></Icon>
            </Button>
          </Tooltip>
          <Tooltip aria-label="Hide" direction={DIRECTION} noDelay>
            <Button
              buttonStyle={EnumButtonStyle.Text}
              onClick={() => {
                setOpen(!open);
              }}
            >
              <Icon icon={"close"} size="small"></Icon>
            </Button>
          </Tooltip>
        </div>

        <AssistantChat />
      </div>
    </>
  );
};

export default Assistant;
