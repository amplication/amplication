import React, { useCallback, useState } from "react";
import {
  Button,
  Dialog,
  EnumTextColor,
  JumboButton,
} from "@amplication/ui/design-system";

import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";

import { CompleteSignupDialog } from "./CompleteSignupDialog";
import { useMutation } from "@apollo/client";
import { COMPLETE_SIGNUP_WITH_BUSINESS_EMAIL } from "../User/UserQueries";
import { CommitBtnType } from "../VersionControl/Commit";

export enum EnumButtonLocation {
  Project = "Project",
  Resource = "Resource",
  EntityList = "EntityList",
  SchemaUpload = "SchemaUpload",
  PreviewBtm = "PreviewBtm",
  Architecture = "Architecture",
}

type Props = {
  buttonText?: string;
  // autoRedirectAfterClick?: boolean;
  buttonType?: CommitBtnType;
};

export const CompleteSignupButton: React.FC<Props> = ({
  buttonText = "Generate the code",
  // autoRedirectAfterClick = false,
  buttonType = CommitBtnType.Button,
}) => {
  const { trackEvent } = useTracking();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [completeSignup] = useMutation(COMPLETE_SIGNUP_WITH_BUSINESS_EMAIL);

  const toggleIsOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleGenerateCodeClicked = useCallback(() => {
    completeSignup();
    setIsOpen(!isOpen);

    trackEvent({
      eventName: AnalyticsEventNames.HelpMenuItemClick,
      action: "Generate code",
      eventOriginLocation: "workspace-header-help-menu",
    });
  }, [completeSignup, isOpen, trackEvent]);

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

      {isOpen && (
        <Dialog
          isOpen={isOpen}
          onDismiss={toggleIsOpen}
          title="Generate your Code"
        >
          <CompleteSignupDialog onConfirm={toggleIsOpen} />
        </Dialog>
      )}
    </>
  );
};
