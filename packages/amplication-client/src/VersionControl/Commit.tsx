import {
  EnumTextColor,
  JumboButton,
  LimitationDialog,
  MultiStateToggle,
  Snackbar,
  TextField,
} from "@amplication/ui/design-system";
import { gql } from "@apollo/client";
import { Form, Formik } from "formik";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { AppContext } from "../context/appContext";
import { EnumSubscriptionPlan } from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./Commit.scss";
import { BillingFeature } from "@amplication/util-billing-types";
import {
  LicenseIndicatorContainer,
  LicensedResourceType,
} from "../Components/LicenseIndicatorContainer";
import useAvailableCodeGenerators from "../Workspaces/hooks/useAvailableCodeGenerators";
import useCommits from "./hooks/useCommits";

const OPTIONS = [
  {
    label: ".NET",
    value: "dotnet",
  },
  {
    label: "Node.js",
    value: "node",
  },
];

type TCommit = {
  message: string;
  bypassLimitations: boolean;
};

const INITIAL_VALUES: TCommit = {
  message: "",
  bypassLimitations: false,
};

type Props = {
  projectId: string;
  noChanges: boolean;
  showCommitMessage?: boolean;
  commitMessage?: string;
  commitBtnType: CommitBtnType;
};
const CLASS_NAME = "commit";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

type RouteMatchProps = {
  workspace: string;
};

export enum CommitBtnType {
  Button = "button",
  JumboButton = "jumboButton",
}

const Commit = ({
  projectId,
  noChanges,
  commitBtnType,
  showCommitMessage = true,
}: Props) => {
  const history = useHistory();
  const { trackEvent } = useTracking();
  const match = useRouteMatch<RouteMatchProps>();
  const [isOpenLimitationDialog, setOpenLimitationDialog] = useState(false);
  const formikRef = useRef(null);

  const { dotNetGeneratorEnabled } = useAvailableCodeGenerators();

  const { setCommitRunning, currentWorkspace } = useContext(AppContext);

  const {
    commitChanges,
    commitChangesError,
    commitChangesLoading,
    commitChangesLimitationError,
  } = useCommits(projectId);

  const redirectToPurchase = () => {
    const path = `/${match.params.workspace}/purchase`;
    history.push(path, { from: { pathname: history.location.pathname } });
  };

  const bypassLimitations = useMemo(() => {
    return (
      currentWorkspace?.subscription?.subscriptionPlan !==
      EnumSubscriptionPlan.Pro
    );
  }, [currentWorkspace]);

  const isLimitationError = commitChangesLimitationError !== undefined ?? false;

  const errorMessage = formatError(commitChangesError);

  const handleSubmit = useCallback(
    (data, { resetForm }) => {
      setCommitRunning(true);
      commitChanges({
        message: data.message,
        projectId,
        bypassLimitations: data.bypassLimitations ?? false,
      });
      formikRef.current.values.bypassLimitations = false;
      resetForm(INITIAL_VALUES);
    },
    [setCommitRunning, commitChanges, projectId]
  );

  const handleOnSelectLanguageChange = useCallback(
    (selectedValue: string) => {
      if (selectedValue === "dotnet") {
        trackEvent({
          eventName: AnalyticsEventNames.ChangedToDotNet,
          workspaceId: currentWorkspace.id,
        });
        history.push(
          `/${currentWorkspace?.id}/${currentProject?.id}/dotnet-upgrade`
        );
      }
    },
    [currentProject?.id, currentWorkspace?.id, history, trackEvent]
  );

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={INITIAL_VALUES}
        onSubmit={handleSubmit}
        validateOnMount
        innerRef={formikRef}
      >
        {(formik) => {
          const handlers = {
            SUBMIT: formik.submitForm,
          };

          return (
            <Form>
              {!commitChangesLoading && (
                <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
              )}
              {showCommitMessage && (
                <TextField
                  rows={3}
                  textarea
                  name="message"
                  label={noChanges ? "Build message" : "Commit message..."}
                  disabled={commitChangesLoading}
                  autoFocus
                  hideLabel
                  placeholder={
                    noChanges ? "Build message" : "Commit message..."
                  }
                  autoComplete="off"
                />
              )}
              {!dotNetGeneratorEnabled && (
                <MultiStateToggle
                  className={`${CLASS_NAME}__technology-toggle`}
                  label=""
                  name="action_"
                  options={OPTIONS}
                  onChange={handleOnSelectLanguageChange}
                  selectedValue={"node"}
                />
              )}
              <LicenseIndicatorContainer
                blockByFeatureId={BillingFeature.BlockBuild}
                licensedResourceType={LicensedResourceType.Project}
              >
                {commitBtnType === CommitBtnType.Button ? (
                  <Button
                    type="submit"
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
                    onClick={formik.submitForm}
                    circleColor={EnumTextColor.ThemeTurquoise}
                  ></JumboButton>
                ) : null}
              </LicenseIndicatorContainer>
            </Form>
          );
        }}
      </Formik>
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
    </div>
  );
};

export default Commit;

export const COMMIT_CHANGES = gql`
  mutation commit(
    $message: String!
    $projectId: String!
    $bypassLimitations: Boolean
  ) {
    commit(
      data: {
        message: $message
        bypassLimitations: $bypassLimitations
        project: { connect: { id: $projectId } }
      }
    ) {
      id
      builds {
        id
        resourceId
        status
      }
    }
  }
`;
