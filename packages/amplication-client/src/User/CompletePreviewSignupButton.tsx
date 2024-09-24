import {
  Button,
  EnumTextColor,
  JumboButton,
} from "@amplication/ui/design-system";
import { useMutation } from "@apollo/client";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { CommitBtnType } from "../VersionControl/Commit";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { COMPLETE_SIGNUP_WITH_BUSINESS_EMAIL } from "./UserQueries";

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
  const [completeSignup] = useMutation(COMPLETE_SIGNUP_WITH_BUSINESS_EMAIL);
  const { baseUrl } = useProjectBaseUrl();

  const handleGenerateCodeClicked = useCallback(() => {
    trackEvent({
      eventName: AnalyticsEventNames.PreviewUser_GenerateCode,
    });

    completeSignup().catch(console.error);

    history.push(`${baseUrl}/complete-preview-signup`);
  }, [completeSignup, history, baseUrl, trackEvent]);

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
