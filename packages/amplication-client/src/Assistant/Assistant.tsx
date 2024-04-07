import { TextField } from "@amplication/ui/design-system";
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

const CLASS_NAME = "assistant";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const Assistant = () => {
  const { trackEvent } = useTracking();

  const [open, setOpen] = useState(false);

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
    <div className={classNames(CLASS_NAME, { [`${CLASS_NAME}--open`]: open })}>
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
        {error && <div className={`${CLASS_NAME}__error`}>{error.message}</div>}
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
  );
};

export default Assistant;
