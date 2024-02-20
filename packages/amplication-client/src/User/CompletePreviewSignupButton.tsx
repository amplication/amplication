import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  EnumTextColor,
  JumboButton,
} from "@amplication/ui/design-system";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useMutation } from "@apollo/client";
import { COMPLETE_SIGNUP_WITH_BUSINESS_EMAIL } from "./UserQueries";
import { CommitBtnType } from "../VersionControl/Commit";
import { useAppContext } from "../context/appContext";

type Props = {
  buttonText?: string;
  buttonType?: CommitBtnType;
};

export const CompletePreviewSignupButton: React.FC<Props> = ({
  buttonText = "Generate the code",
  buttonType = CommitBtnType.Button,
}) => {
  const history = useHistory();
  const { trackEvent } = useTracking();
  const { currentWorkspace, currentProject } = useAppContext();
  const [completeSignup] = useMutation(COMPLETE_SIGNUP_WITH_BUSINESS_EMAIL);

  const handleGenerateCodeClicked = useCallback(() => {
    completeSignup();
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/complete-preview-signup`
    );

    trackEvent({
      eventName: AnalyticsEventNames.PreviewUser_GenerateCode,
    });
  }, [completeSignup, history, currentWorkspace, currentProject, trackEvent]);

  return (
    <>
      {buttonType === CommitBtnType.JumboButton && (
        <JumboButton
          text="Generate the code for my new architecture"
          icon="pending_changes"
          onClick={handleGenerateCodeClicked}
          circleColor={EnumTextColor.ThemeTurquoise}
        ></JumboButton>
      )}
      {buttonType === CommitBtnType.Button && (
        <Button onClick={handleGenerateCodeClicked}>{buttonText}</Button>
      )}
    </>
  );
};
