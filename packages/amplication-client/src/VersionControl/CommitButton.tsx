import {
  EnumTextColor,
  JumboButton,
  LimitationDialog,
  Snackbar,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useRef, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { AppContext } from "../context/appContext";
import { EnumCommitStrategy, EnumResourceTypeGroup } from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import "./Commit.scss";
import { BillingFeature } from "@amplication/util-billing-types";
import {
  LicenseIndicatorContainer,
  LicensedResourceType,
} from "../Components/LicenseIndicatorContainer";
import useCommits from "./hooks/useCommits";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

type Props = {
  commitMessage?: string;
  commitBtnType?: CommitBtnType;
  onCommitChanges?: () => void;
  resourceTypeGroup: EnumResourceTypeGroup;
  hasPendingChanges: boolean;
  hasMultipleServices: boolean;
  commitStrategy?: EnumCommitStrategy;
  onCommitSpecificService?: () => void;
};

type RouteMatchProps = {
  workspace: string;
};

export enum CommitBtnType {
  Button = "button",
  JumboButton = "jumboButton",
}

const CommitButton = ({
  commitBtnType = CommitBtnType.Button,
  commitMessage = "",
  onCommitChanges,
  resourceTypeGroup,
  hasPendingChanges,
  hasMultipleServices,
  commitStrategy,
  onCommitSpecificService,
}: Props) => {
  const history = useHistory();
  const { trackEvent } = useTracking();
  const match = useRouteMatch<RouteMatchProps>();
  const [isOpenLimitationDialog, setOpenLimitationDialog] =
    useState<boolean>(false);

  const { currentProject } = useContext(AppContext);
  const { baseUrl: platformBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: true,
  });

  const {
    commitChanges,
    commitChangesError,
    commitChangesLoading,
    commitChangesLimitationError,
    bypassLimitations,
  } = useCommits(currentProject?.id);

  const bypassLimitationsRef = useRef(bypassLimitations);

  const redirectToPurchase = () => {
    const path = `/${match.params.workspace}/purchase`;
    history.push(path, { from: { pathname: history.location.pathname } });
  };

  const handleClick = useCallback(() => {
    if (resourceTypeGroup === EnumResourceTypeGroup.Platform) {
      history.push(`${platformBaseUrl}/publish`);
      return;
    }

    const strategy = hasPendingChanges //use the default strategy when provided
      ? EnumCommitStrategy.AllWithPendingChanges //default when there are pending changes
      : hasMultipleServices && onCommitSpecificService
      ? EnumCommitStrategy.Specific //let the user choose when there are multiple services and no changes
      : EnumCommitStrategy.All; //use all when there is only one service

    if (strategy === EnumCommitStrategy.Specific) {
      onCommitSpecificService();
      return;
    }

    commitChanges({
      message: commitMessage,
      project: { connect: { id: currentProject?.id } },
      bypassLimitations: bypassLimitationsRef.current ?? false,
      commitStrategy: strategy,
      resourceTypeGroup,
    });

    onCommitChanges && onCommitChanges();
  }, [
    resourceTypeGroup,
    hasPendingChanges,
    hasMultipleServices,
    onCommitSpecificService,
    commitChanges,
    commitMessage,
    currentProject?.id,
    onCommitChanges,
    history,
    platformBaseUrl,
  ]);

  const isLimitationError = commitChangesLimitationError !== undefined ?? false;

  const errorMessage = formatError(commitChangesError);

  const element =
    commitBtnType === CommitBtnType.Button ? (
      resourceTypeGroup === EnumResourceTypeGroup.Services ? (
        <Button
          onClick={handleClick}
          buttonStyle={EnumButtonStyle.Primary}
          eventData={{
            eventName: AnalyticsEventNames.CommitClicked,
          }}
          disabled={commitChangesLoading}
        >
          Generate the code
        </Button>
      ) : (
        <Button
          onClick={handleClick}
          buttonStyle={EnumButtonStyle.Primary}
          eventData={{
            eventName: AnalyticsEventNames.CommitClicked,
          }}
          disabled={!hasPendingChanges || commitChangesLoading}
        >
          Publish Changes
        </Button>
      )
    ) : commitBtnType === CommitBtnType.JumboButton ? (
      <JumboButton
        text="Generate the code for my new architecture"
        icon="pending_changes"
        onClick={handleClick}
        circleColor={EnumTextColor.ThemeTurquoise}
      ></JumboButton>
    ) : null;

  return (
    <>
      <LicenseIndicatorContainer
        blockByFeatureId={BillingFeature.BlockBuild}
        licensedResourceType={LicensedResourceType.Project}
      >
        {element}
      </LicenseIndicatorContainer>
      {commitChangesError && isLimitationError ? (
        <LimitationDialog
          isOpen={isOpenLimitationDialog}
          message={commitChangesLimitationError.message}
          allowBypassLimitation={bypassLimitations}
          onConfirm={() => {
            redirectToPurchase();
            trackEvent({
              eventName: AnalyticsEventNames.UpgradeClick,
              reason: commitChangesLimitationError.message,
              eventOriginLocation: "commit-limitation-dialog",
              billingFeature: commitChangesLimitationError.billingFeature,
            });
            setOpenLimitationDialog(false);
          }}
          onDismiss={() => {
            bypassLimitationsRef.current = false;
            trackEvent({
              eventName: AnalyticsEventNames.PassedLimitsNotificationClose,
              reason: commitChangesLimitationError.message,
              eventOriginLocation: "commit-limitation-dialog",
            });
            setOpenLimitationDialog(false);
          }}
          onBypass={() => {
            bypassLimitationsRef.current = true;
            trackEvent({
              eventName: AnalyticsEventNames.UpgradeLaterClick,
              reason: commitChangesLimitationError.message,
              eventOriginLocation: "commit-limitation-dialog",
              billingFeature: commitChangesLimitationError.billingFeature,
            });
            setOpenLimitationDialog(false);
          }}
        />
      ) : (
        <Snackbar open={Boolean(commitChangesError)} message={errorMessage} />
      )}
    </>
  );
};

export default CommitButton;
