import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import UserBadge from "../Components/UserBadge";
import * as models from "../models";
import { AssistantMessageWithOptions } from "./hooks/useAssistant";

import JovuLogo from "./JovuLogo";

const CLASS_NAME = "assistant-chat";

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
            <JovuLogo loading={message.loading} />
            Jovu
          </>
        )}
      </div>
      <div className={`${CLASS_NAME}__message__content`}>
        <ReactMarkdown
          components={{
            a: (props) => {
              const url = new URL(props.href);
              return url.host === window.location.host ? (
                <Link to={`${url.pathname}${url.search}${url.hash}`}>
                  {props.children}
                </Link>
              ) : (
                <a href={props.href} target="_blank" rel="noreferrer">
                  {props.children}
                </a> // All other links
              );
            },
          }}
        >
          {message.text}
        </ReactMarkdown>
      </div>
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
