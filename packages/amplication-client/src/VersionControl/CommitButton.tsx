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
import { EnumCommitStrategy } from "../models";
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

type Props = {
  commitMessage?: string;
  commitBtnType?: CommitBtnType;
  commitStrategy?: EnumCommitStrategy;
  selectedService?: string;
  onCommitChanges?: () => void;
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
  commitStrategy = EnumCommitStrategy.All,
  selectedService = null,
  onCommitChanges,
}: Props) => {
  const history = useHistory();
  const { trackEvent } = useTracking();
  const match = useRouteMatch<RouteMatchProps>();
  const [isOpenLimitationDialog, setOpenLimitationDialog] =
    useState<boolean>(false);

  const formikRef = useRef(null);

  const { currentProject } = useContext(AppContext);

  const {
    commitChanges,
    commitChangesError,
    commitChangesLoading,
    commitChangesLimitationError,
    bypassLimitations,
  } = useCommits(currentProject?.id);

  const redirectToPurchase = () => {
    const path = `/${match.params.workspace}/purchase`;
    history.push(path, { from: { pathname: history.location.pathname } });
  };

  const handleClick = useCallback(() => {
    commitChanges({
      message: commitMessage,
      project: { connect: { id: currentProject?.id } },
      bypassLimitations: bypassLimitations ?? false,
      commitStrategy,
      resourceIds: selectedService && [selectedService],
    });

    onCommitChanges && onCommitChanges();
  }, [
    commitChanges,
    currentProject,
    commitMessage,
    bypassLimitations,
    onCommitChanges,
    commitStrategy,
    selectedService,
  ]);

  const isLimitationError = commitChangesLimitationError !== undefined ?? false;

  const errorMessage = formatError(commitChangesError);

  return (
    <>
      <LicenseIndicatorContainer
        blockByFeatureId={BillingFeature.BlockBuild}
        licensedResourceType={LicensedResourceType.Project}
      >
        {commitBtnType === CommitBtnType.Button ? (
          <Button
            onClick={handleClick}
            buttonStyle={EnumButtonStyle.Primary}
            eventData={{
              eventName: AnalyticsEventNames.CommitClicked,
            }}
            disabled={commitChangesLoading}
          >
            <>Generate the code </>
          </Button>
        ) : commitBtnType === CommitBtnType.JumboButton ? (
          <JumboButton
            text="Generate the code for my new architecture"
            icon="pending_changes"
            onClick={handleClick}
            circleColor={EnumTextColor.ThemeTurquoise}
          ></JumboButton>
        ) : null}
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
              billingFeature:
                commitChangesLimitationError.extensions.billingFeature,
            });
            setOpenLimitationDialog(false);
          }}
          onDismiss={() => {
            formikRef.current.values.bypassLimitations = false;
            trackEvent({
              eventName: AnalyticsEventNames.PassedLimitsNotificationClose,
              reason: commitChangesLimitationError.message,
              eventOriginLocation: "commit-limitation-dialog",
            });
            setOpenLimitationDialog(false);
          }}
          onBypass={() => {
            formikRef.current.values.bypassLimitations = true;
            formikRef.current.handleSubmit(formikRef.current.values, {
              resetForm: formikRef.current.resetForm,
            });

            trackEvent({
              eventName: AnalyticsEventNames.UpgradeLaterClick,
              reason: commitChangesLimitationError.message,
              eventOriginLocation: "commit-limitation-dialog",
              billingFeature:
                commitChangesLimitationError.extensions.billingFeature,
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
