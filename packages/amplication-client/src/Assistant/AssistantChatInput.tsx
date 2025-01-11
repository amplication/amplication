import { TextField } from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { isEmpty } from "lodash";
import { useCallback, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";

import "./AssistantChatInput.scss";

type SendMessageType = models.SendAssistantMessageInput;

const INITIAL_VALUES: SendMessageType = {
  message: "",
};

const CLASS_NAME = "assistant-chat-input";

const KEY_MAP = [
  "mod+enter",
  "ctrl+enter",
  "command+enter",
  "shift+enter",
  "enter",
];

type Props = {
  disabled: boolean;
  sendMessage: (message: string) => void;
  placeholder?: string;
};

const AssistantChatInput = ({ disabled, sendMessage, placeholder }: Props) => {
  const [rowCount, setRowCount] = useState(1);

  const handleSubmit = useCallback(
    (data: SendMessageType, { setErrors, resetForm }) => {
      if (!disabled && !isEmpty(data?.message.replace("\n", "").trim())) {
        sendMessage(data.message);
        setRowCount(1);
        resetForm({ values: INITIAL_VALUES });
      }
    },
    [disabled, sendMessage]
  );

  const formRef = useRef(null);

  const ref = useHotkeys<HTMLFormElement>(
    KEY_MAP,
    (event, handler) => {
      if (handler.keys.includes("enter") && handler.shift) {
        setRowCount((prev) => prev + 1);
        return;
      }

      formRef.current?.submitForm();
      event.preventDefault();
    },
    {
      enableOnFormTags: true,
    }
  );

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        innerRef={formRef}
      >
        <Form ref={ref}>
          <TextField
            placeholder={placeholder}
            textarea
            name="message"
            label="How can I help you?"
            autoFocus
            autoComplete="off"
            hideLabel
            rows={2}
            style={{
              "--input-lines": rowCount, //set the css variable to the theme color to be used from the css file
            }}
          />
          <Button
            type="submit"
            buttonStyle={EnumButtonStyle.Primary}
            disabled={disabled}
          >
            Send
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default AssistantChatInput;
