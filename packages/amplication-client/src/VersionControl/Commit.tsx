import {
  Dialog,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  FlexItem,
  JumboButton,
  LimitationDialog,
  MultiStateToggle,
  RadioButtonField,
  SelectMenu,
  SelectMenuList,
  SelectMenuModal,
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
import {
  EnumCommitStrategy,
  EnumResourceType,
  EnumSubscriptionPlan,
} from "../models";
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
import CreateCommitStrategyButtonItem from "./CreateCommitStrategyButtonItem";
import "./CreateCommitStrategyButton.scss";
import usePendingChanges from "../Workspaces/hooks/usePendingChanges";

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
  commitStrategy: EnumCommitStrategy;
  selectedService: string;
};

const INITIAL_VALUES: TCommit = {
  message: "",
  bypassLimitations: false,
  commitStrategy: EnumCommitStrategy.All,
  selectedService: null,
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

export type commitStrategyOption = {
  strategyType: EnumCommitStrategy;
  label: string;
};

const commitStrategyOptions: commitStrategyOption[] = [
  {
    strategyType: EnumCommitStrategy.All,
    label: "Generate code for all services",
  },
  {
    strategyType: EnumCommitStrategy.AllWithPendingChanges,
    label: "Generate code for all services that have pending changes",
  },
  {
    strategyType: EnumCommitStrategy.Specific,
    label: "Generate code for a specific service",
  },
];

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

  const { setCommitRunning, currentWorkspace, currentProject, resources } =
    useContext(AppContext);

  const { pendingChanges } = usePendingChanges(currentProject);
  const [specificServiceSelected, setSpecificServiceSelected] =
    useState<boolean>(false);

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
        project: { connect: { id: currentProject?.id } },
        bypassLimitations: data.bypassLimitations ?? false,
        commitStrategy: data.commitStrategy,
        resourceIds: [data.selectedService],
      });
      formikRef.current.values.bypassLimitations = false;
      resetForm(INITIAL_VALUES);
    },
    [setCommitRunning, commitChanges, currentProject]
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

  const handleOnSelectCommitStrategyChange = useCallback(
    (selectedValue) => {
      formikRef.current.values.commitStrategy = selectedValue.strategyType;
      if (
        selectedValue.strategyType === EnumCommitStrategy.Specific &&
        !specificServiceSelected
      ) {
        setSpecificServiceSelected(true);
        return;
      }

      formikRef.current.submitForm();
    },
    [setSpecificServiceSelected, specificServiceSelected]
  );

  const handleOnSelectSpecificServiceChange = useCallback(() => {
    setSpecificServiceSelected(false);
    formikRef.current.submitForm();
  }, [setSpecificServiceSelected]);

  const handleSpecificServiceSelectedDismiss = useCallback(() => {
    setSpecificServiceSelected(false);
  }, [setSpecificServiceSelected]);

  const handleSelectedServiceChanged = useCallback((resourceId: string) => {
    formikRef.current.values.selectedService = resourceId;
  }, []);

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
                  <div>
                    <FlexItem
                      direction={EnumFlexDirection.Row}
                      itemsAlign={EnumItemsAlign.Center}
                      gap={EnumGapSize.None}
                    >
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
                      <SelectMenu
                        title=""
                        icon="chevron_down"
                        buttonStyle={EnumButtonStyle.Text}
                      >
                        <SelectMenuModal align="right" withCaret>
                          <SelectMenuList>
                            {commitStrategyOptions.map((item, index) => (
                              <CreateCommitStrategyButtonItem
                                key={index}
                                item={item}
                                hasPendingChanges={pendingChanges?.length > 0}
                                onCommitStrategySelected={
                                  handleOnSelectCommitStrategyChange
                                }
                              ></CreateCommitStrategyButtonItem>
                            ))}
                          </SelectMenuList>
                        </SelectMenuModal>
                      </SelectMenu>
                    </FlexItem>
                    <Dialog
                      title="Please Select a service to generate"
                      isOpen={specificServiceSelected}
                      onDismiss={handleSpecificServiceSelectedDismiss}
                    >
                      <FlexItem
                        direction={EnumFlexDirection.Column}
                        itemsAlign={EnumItemsAlign.Start}
                      >
                        {resources
                          .filter(
                            (r) => r.resourceType === EnumResourceType.Service
                          )
                          .map((resource, index) => (
                            <RadioButtonField
                              name="selectedService"
                              checked={
                                formik.values.selectedService === resource.id
                              }
                              label={resource.name}
                              onChange={() => {
                                handleSelectedServiceChanged(resource.id);
                              }}
                            />
                          ))}
                        <Button onClick={handleOnSelectSpecificServiceChange}>
                          generate the code
                        </Button>
                      </FlexItem>
                    </Dialog>
                  </div>
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
  mutation commit($data: CommitCreateInput!) {
    commit(data: $data) {
      id
      builds {
        id
        resourceId
        status
      }
    }
  }
`;
