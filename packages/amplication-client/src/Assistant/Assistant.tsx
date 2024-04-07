import {
  EnumTextColor,
  EnumTextStyle,
  Icon,
  Text,
  TextField,
  Tooltip,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./Assistant.scss";
import useAssistant from "./hooks/useAssistant";
import ReactMarkdown from "react-markdown";
import AssistantMessage from "./AssistantMessage";
import classNames from "classnames";
type SendMessageType = models.SendAssistantMessageInput;

const INITIAL_VALUES: SendMessageType = {
  message: "",
};
const DIRECTION = "sw";

const CLASS_NAME = "assistant";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
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
  const { trackEvent } = useTracking();

  const [open, setOpen] = useState(true);
  const [widthState, setWidthState] = useState(WIDTH_STATE_DEFAULT);

  const {
    sendMessage,
    messages,
    sendMessageError: error,
    sendMessageLoading: loading,
  } = useAssistant();

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
            Jovu
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
          <Icon icon="ai" color={EnumTextColor.White} size="large" />
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

        <div className={`${CLASS_NAME}__messages`}>
          {messages.map((message) => (
            <AssistantMessage
              key={message.id}
              message={message}
              onOptionClick={sendMessage}
            />
          ))}
          {loading && (
            <div className={`${CLASS_NAME}__message`}>
              <ReactMarkdown>Thinking...</ReactMarkdown>
            </div>
          )}
          {error && (
            <div className={`${CLASS_NAME}__error`}>{error.message}</div>
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
                  <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
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
      </div>
    </>
  );
};

export default Assistant;
