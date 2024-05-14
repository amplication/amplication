import { TextField } from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { isEmpty } from "lodash";
import { useCallback, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { CLASS_NAME } from "./Assistant";

import "./Assistant.scss";

type SendMessageType = models.SendAssistantMessageInput;

const INITIAL_VALUES: SendMessageType = {
  message: "",
};

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
};

const AssistantChatInput = ({ disabled, sendMessage }: Props) => {
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

  const ref = useHotkeys<HTMLInputElement>(
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
    <div className={`${CLASS_NAME}__chat_input`}>
      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        innerRef={formRef}
      >
        <Form>
          <TextField
            textarea
            name="message"
            label="How can I help you?"
            autoFocus
            autoComplete="off"
            hideLabel
            rows={2}
            ref={ref}
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
