import {
  LimitationDialog,
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
import { FeatureIndicator } from "../Components/FeatureIndicator";

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

const formatLimitationError = (errorMessage: string) => {
  const LIMITATION_ERROR_PREFIX = "LimitationError: ";

  const limitationError = errorMessage.split(LIMITATION_ERROR_PREFIX)[1];
  return limitationError;
};

const Commit = ({ projectId, noChanges }: Props) => {
  const history = useHistory();
  const { trackEvent } = useTracking();
  const match = useRouteMatch<RouteMatchProps>();
  const [isOpenLimitationDialog, setOpenLimitationDialog] = useState(false);
  const formikRef = useRef(null);

  const {
    setCommitRunning,
    resetPendingChanges,
    setPendingChangesError,
    currentWorkspace,
    currentProject,
    commitUtils,
  } = useContext(AppContext);

  const isProjectUnderLimitation = currentProject?.isUnderLimitation ?? false;
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
              <TextField
                rows={3}
                textarea
                name="message"
                label={noChanges ? "Build message" : "Commit message..."}
                disabled={loading}
                autoFocus
                hideLabel
                placeholder={noChanges ? "Build message" : "Commit message..."}
                autoComplete="off"
              />

              {isProjectUnderLimitation ? (
                <FeatureIndicator
                  featureName={BillingFeature.Projects}
                  text="The workspace reached your plan's project limitation."
                  element={
                    <Button
                      type="submit"
                      icon="locked"
                      buttonStyle={EnumButtonStyle.Primary}
                      eventData={{
                        eventName: AnalyticsEventNames.CommitClicked,
                      }}
                      disabled={loading || isProjectUnderLimitation}
                    >
                      {noChanges ? "Rebuild" : "Commit changes & build "}
                    </Button>
                  }
                />
              ) : (
                <Button
                  type="submit"
                  buttonStyle={EnumButtonStyle.Primary}
                  eventData={{
                    eventName: AnalyticsEventNames.CommitClicked,
                  }}
                  disabled={loading || isProjectUnderLimitation}
                >
                  {noChanges ? "Rebuild" : "Commit changes & build "}
                </Button>
              )}
            </Form>
          );
        }}
      </Formik>

      {error && isLimitationError ? (
        <LimitationDialog
          isOpen={isOpenLimitationDialog}
          message={limitationError.message}
          allowBypassLimitation={
            currentWorkspace?.subscription?.subscriptionPlan !==
            EnumSubscriptionPlan.Pro
          }
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
