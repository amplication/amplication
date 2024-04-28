import {
  EnumTextColor,
  EnumTextStyle,
  Icon,
  Text,
  TextField,
  Tooltip,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import { HotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import "./Assistant.scss";
import useAssistant from "./hooks/useAssistant";
import AssistantMessage from "./AssistantMessage";
import classNames from "classnames";
import { useAppContext } from "../context/appContext";
import { Link } from "react-router-dom";
import jovu from "../assets/jovu.svg";
type SendMessageType = models.SendAssistantMessageInput;

const INITIAL_VALUES: SendMessageType = {
  message: "",
};
const DIRECTION = "sw";

const CLASS_NAME = "assistant";

const keyMap = {
  SUBMIT: "enter",
};

const WIDTH_STATE_DEFAULT = "default";
const WIDTH_STATE_WIDE = "wide";

const WIDTH_STATE_SETTINGS: Record<
  string,
  { icon: string; tooltip: string; nextState: string }
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

  const [open, setOpen] = useState(true);
  const [widthState, setWidthState] = useState(WIDTH_STATE_DEFAULT);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const {
    sendMessage,
    messages,
    sendMessageError: error,
    processingMessage: loading,
    streamError,
  } = useAssistant();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = useCallback(
    (data: SendMessageType, { setErrors, resetForm }) => {
      sendMessage(data.message);
      resetForm({ values: INITIAL_VALUES });
    },
    [sendMessage]
  );

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

        {currentWorkspace?.allowLLMFeatures ? (
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
              {error && (
                <div className={`${CLASS_NAME}__error`}>{error.message}</div>
              )}
              {streamError && (
                <div className={`${CLASS_NAME}__error`}>
                  {streamError.message}
                </div>
              )}
            </div>

            <div className={`${CLASS_NAME}__chat_input`}>
              <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
                {(formik) => {
                  const handlers = {
                    SUBMIT: formik.submitForm,
                  };
                  return (
                    <Form>
                      <HotKeys
                        keyMap={keyMap}
                        handlers={handlers}
                        className={`${CLASS_NAME}__text-wrapper`}
                      >
                        <TextField
                          textarea
                          name="message"
                          label="How can I help you?"
                          disabled={loading}
                          autoFocus
                          autoComplete="off"
                          hideLabel
                          rows={2}
                        />
                      </HotKeys>
                      <Button
                        type="submit"
                        buttonStyle={EnumButtonStyle.Primary}
                        disabled={loading}
                      >
                        Send
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </div>
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
