import {
  EnumTextColor,
  JumboButton,
  LimitationDialog,
  MultiStateToggle,
  Snackbar,
  TextField,
} from "@amplication/ui/design-system";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { AppContext } from "../context/appContext";
import { EnumSubscriptionPlan, type Commit as CommitType } from "../models";
import { GraphQLErrorCode } from "@amplication/graphql-error-codes";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { commitPath } from "../util/paths";
import "./Commit.scss";
import { BillingFeature } from "@amplication/util-billing-types";
import {
  LicenseIndicatorContainer,
  LicensedResourceType,
} from "../Components/LicenseIndicatorContainer";
import useAvailableCodeGenerators from "../Workspaces/hooks/useAvailableCodeGenerators";

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

type TData = {
  commit: CommitType;
};

type RouteMatchProps = {
  workspace: string;
};

export enum CommitBtnType {
  Button = "button",
  JumboButton = "jumboButton",
}

const formatLimitationError = (errorMessage: string) => {
  const LIMITATION_ERROR_PREFIX = "LimitationError: ";

  const limitationError = errorMessage.split(LIMITATION_ERROR_PREFIX)[1];
  return limitationError;
};

const Commit = ({
  projectId,
  noChanges,
  commitBtnType,
  showCommitMessage = true,
  commitMessage,
}: Props) => {
  const history = useHistory();
  const { trackEvent } = useTracking();
  const match = useRouteMatch<RouteMatchProps>();
  const [isOpenLimitationDialog, setOpenLimitationDialog] = useState(false);
  const formikRef = useRef(null);

  const { dotNetGeneratorEnabled } = useAvailableCodeGenerators();

  const {
    setCommitRunning,
    resetPendingChanges,
    setPendingChangesError,
    currentWorkspace,
    currentProject,
    commitUtils,
  } = useContext(AppContext);

  const redirectToPurchase = () => {
    const path = `/${match.params.workspace}/purchase`;
    history.push(path, { from: { pathname: history.location.pathname } });
  };

  const [commit, { error, loading }] = useMutation<TData>(COMMIT_CHANGES, {
    onError: (error: ApolloError) => {
      setCommitRunning(false);
      setPendingChangesError(true);

      setOpenLimitationDialog(
        error?.graphQLErrors?.some(
          (gqlError) =>
            gqlError.extensions.code ===
            GraphQLErrorCode.BILLING_LIMITATION_ERROR
        ) ?? false
      );
    },
    onCompleted: (response) => {
      formikRef.current.values.bypassLimitations = false;
      setCommitRunning(false);
      setPendingChangesError(false);
      resetPendingChanges();
      commitUtils.refetchCommitsData(true);
      const path = commitPath(
        currentWorkspace?.id,
        currentProject?.id,
        response.commit.id
      );
      return history.push(path);
    },
  });

  const bypassLimitations = useMemo(() => {
    return (
      currentWorkspace?.subscription?.subscriptionPlan !==
      EnumSubscriptionPlan.Pro
    );
  }, [currentWorkspace]);

  const limitationError = useMemo(() => {
    if (!error) return;
    const limitation = error?.graphQLErrors?.find(
      (gqlError) =>
        gqlError.extensions.code === GraphQLErrorCode.BILLING_LIMITATION_ERROR
    );

    limitation.message = formatLimitationError(error.message);
    return limitation;
  }, [error]);

  const isLimitationError = limitationError !== undefined ?? false;

  const errorMessage = formatError(error);

  const handleSubmit = useCallback(
    (data, { resetForm }) => {
      setCommitRunning(true);
      commit({
        variables: {
          message: data.message,
          projectId,
          bypassLimitations: data.bypassLimitations ?? false,
        },
      }).catch(console.error);
      resetForm(INITIAL_VALUES);
    },
    [setCommitRunning, commit, projectId]
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
              {!loading && (
                <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
              )}
              {showCommitMessage && (
                <TextField
                  rows={3}
                  textarea
                  name="message"
                  label={noChanges ? "Build message" : "Commit message..."}
                  disabled={loading}
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
                    disabled={loading}
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
      {error && isLimitationError ? (
        <LimitationDialog
          isOpen={isOpenLimitationDialog}
          message={limitationError.message}
          allowBypassLimitation={bypassLimitations}
          onConfirm={() => {
            redirectToPurchase();
            trackEvent({
              eventName: AnalyticsEventNames.UpgradeClick,
              reason: limitationError.message,
              eventOriginLocation: "commit-limitation-dialog",
              billingFeature: limitationError.extensions.billingFeature,
            });
            setOpenLimitationDialog(false);
          }}
          onDismiss={() => {
            formikRef.current.values.bypassLimitations = false;
            trackEvent({
              eventName: AnalyticsEventNames.PassedLimitsNotificationClose,
              reason: limitationError.message,
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
              reason: limitationError.message,
              eventOriginLocation: "commit-limitation-dialog",
              billingFeature: limitationError.extensions.billingFeature,
            });
            setOpenLimitationDialog(false);
          }}
        />
      ) : (
        <Snackbar open={Boolean(error)} message={errorMessage} />
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
