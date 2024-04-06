import { UserAvatar } from "@amplication/ui/design-system";
import ReactMarkdown from "react-markdown";
import UserBadge from "../Components/UserBadge";
import * as models from "../models";

const CLASS_NAME = "assistant";

type Props = {
  message: models.AssistantMessage;
};

const AssistantMessage = ({ message }: Props) => {
  return (
    <div key={message.id} className={`${CLASS_NAME}__message`}>
      {message.role === models.EnumAssistantMessageRole.User ? (
        <div className={`${CLASS_NAME}__user-message`}>
          <div className={`${CLASS_NAME}__message-role`}>
            <UserBadge />
            You
          </div>
          <ReactMarkdown className="amp-text--tag">
            {message.text}
          </ReactMarkdown>
        </div>
      ) : (
        <div className={`${CLASS_NAME}__assistant-message`}>
          <div className={`${CLASS_NAME}__message-role`}>
            <UserAvatar firstName={"A"} lastName={"P"} />
            Assistant
          </div>
          <ReactMarkdown className="amp-text--tag">
            {message.text}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default AssistantMessage;
