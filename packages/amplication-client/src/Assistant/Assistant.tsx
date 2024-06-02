import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Text,
  Tooltip,
} from "@amplication/ui/design-system";
import { BillingFeature } from "@amplication/util-billing-types";
import { useQuery } from "@apollo/client";
import { useStiggContext } from "@stigg/react-sdk";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { GET_CONTACT_US_LINK } from "../Workspaces/queries/workspaceQueries";
import jovu from "../assets/jovu-logo.svg";
import { useAppContext } from "../context/appContext";
import "./Assistant.scss";
import AssistantChatInput from "./AssistantChatInput";
import AssistantMessage from "./AssistantMessage";
import JovuLogo from "./JovuLogo";
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
  const { currentWorkspace } = useAppContext();

  const {
    open,
    setOpen,
    widthState,
    setWidthState,
    sendMessage,
    messages,
    processingMessage: loading,
    streamError,
  } = useAssistantContext();

  const { stigg } = useStiggContext();

  const { hasAccess } = stigg.getMeteredEntitlement({
    featureId: BillingFeature.JovuRequests,
  });

  const { data } = useQuery(GET_CONTACT_US_LINK, {
    variables: { id: currentWorkspace.id },
  });

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
      {!open && (
        <div className={`${CLASS_NAME}__handle`} onClick={() => setOpen(true)}>
          <Icon icon="ai" color={EnumTextColor.White} size="large" />
          <Text className={`${CLASS_NAME}__title`} textStyle={EnumTextStyle.H4}>
            Jovu (Beta)
          </Text>
        </div>
      )}
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
            Jovu (Beta)
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

        {!hasAccess ? (
          <FlexItem
            direction={EnumFlexDirection.Column}
            itemsAlign={EnumItemsAlign.Center}
            contentAlign={EnumContentAlign.Center}
            gap={EnumGapSize.Large}
            className={`${CLASS_NAME}__limit`}
          >
            <JovuLogo />
            <Text textStyle={EnumTextStyle.H3} textAlign={EnumTextAlign.Center}>
              You have reached the daily limit of Jovu requests for your plan.
            </Text>
            <Text
              textStyle={EnumTextStyle.Tag}
              textAlign={EnumTextAlign.Center}
            >
              Talk with us to upgrade and discover additional hidden
              functionalities.
            </Text>
            <Text
              textColor={EnumTextColor.White}
              textStyle={EnumTextStyle.Tag}
              textAlign={EnumTextAlign.Center}
            >
              <a
                className={`${CLASS_NAME}__addon-section__contact-us`}
                href={data?.contactUsLink}
                target="blank"
              >
                <Text
                  textColor={EnumTextColor.ThemeTurquoise}
                  textStyle={EnumTextStyle.Tag}
                >
                  Talk with us
                </Text>
              </a>
            </Text>
          </FlexItem>
        ) : currentWorkspace?.allowLLMFeatures ? (
          <>
            <div className={`${CLASS_NAME}__messages`}>
              {messages.map((message) => (
                <AssistantMessage
                  key={message.id}
                  message={message}
                  onOptionClick={sendMessage}
                />
              ))}

              <div ref={messagesEndRef} />
              {streamError && (
                <div className={`${CLASS_NAME}__error`}>
                  {streamError.message}
                </div>
              )}
            </div>

            <AssistantChatInput disabled={loading} sendMessage={sendMessage} />
          </>
        ) : (
          <div className={`${CLASS_NAME}__messages`}>
            <div className={`${CLASS_NAME}__error`}>
              This feature is disabled for this workspace. To enable AI-powered
              features,{" "}
              <Link
                to={`/${currentWorkspace?.id}/settings`}
                className={`${CLASS_NAME}__settings-link`}
              >
                go to workspace settings.
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Assistant;
