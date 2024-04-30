import { Icon } from "@amplication/ui/design-system";
import { Collapse } from "@mui/material";
import { useCallback, useState } from "react";

import "../Purchase/Question.scss";
import { useTracking } from "react-tracking";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useAppContext } from "../context/appContext";

type Props = {
  option: string;
  answer: string | React.ReactNode | JSX.Element;
  type: string;
};

const CLASS_NAME = "question";

export const DotNetPromoteOption = ({ option, answer, type }: Props) => {
  const { currentWorkspace } = useAppContext();
  const [open, setOpen] = useState(false);
  const { trackEvent } = useTracking();

  const handleOnCLick = useCallback(() => {
    setOpen(!open);
    trackEvent({
      eventName: AnalyticsEventNames.ChoseDotNetUsage,
      workspaceId: currentWorkspace?.id,
      type: type,
    });
  }, [open, trackEvent, currentWorkspace?.id, type]);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__header`} onClick={handleOnCLick}>
        <div className={`${CLASS_NAME}__header__text`}>{option}</div>
        <Icon icon={open ? "chevron_up" : "chevron_down"} />
      </div>
      <Collapse in={open}>
        <div className={`${CLASS_NAME}__separator`}></div>
        <div className={`${CLASS_NAME}__answer`}>{answer}</div>
      </Collapse>
    </div>
  );
};
