import {
  Button,
  EnumButtonStyle,
  EnumTextColor,
  Icon,
} from "@amplication/ui/design-system";
import ReactMarkdown from "react-markdown";
import UserBadge from "../Components/UserBadge";
import * as models from "../models";
import { AssistantMessageWithOptions } from "./hooks/useAssistant";
import { Link } from "react-router-dom";

const CLASS_NAME = "assistant";

type Props = {
  message: AssistantMessageWithOptions;
  onOptionClick?: (option: string) => void;
};

const AssistantMessage = ({ message, onOptionClick }: Props) => {
  return (
    <div key={message.id} className={`${CLASS_NAME}__message`}>
      <div className={`${CLASS_NAME}__message-role`}>
        {message.role === models.EnumAssistantMessageRole.User ? (
          <>
            {" "}
            <UserBadge /> You
          </>
        ) : (
          <>
            <Icon icon="ai" color={EnumTextColor.ThemeTurquoise} size="large" />
            Jovu
          </>
        )}
      </div>
      <ReactMarkdown
        components={{
          a: (props) => {
            const url = new URL(props.href);
            return url.host === window.location.host ? (
              <Link to={`${url.pathname}${url.search}${url.hash}`}>
                {props.children}
              </Link>
            ) : (
              <a href={props.href}>{props.children}</a> // All other links
            );
          },
        }}
      >
        {message.text}
      </ReactMarkdown>
      <div className={`${CLASS_NAME}__message__options`}>
        {message.options?.map((option) => (
          <Button
            onClick={() => onOptionClick(option)}
            key={option}
            buttonStyle={EnumButtonStyle.GradientOutline}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AssistantMessage;
