import {
  Button,
  Dialog,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
  SelectMenu,
  SelectMenuList,
  SelectMenuModal,
  TextField,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import ResourceTypeBadge from "../Components/ResourceTypeBadge";
import { AppContext } from "../context/appContext";
import {
  EnumCommitStrategy,
  EnumResourceType,
  EnumResourceTypeGroup,
} from "../models";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import usePendingChanges from "../Workspaces/hooks/usePendingChanges";
import "./Commit.scss";
import CommitButton from "./CommitButton";
import "./CreateCommitStrategyButton.scss";
import CreateCommitStrategyButtonItem from "./CreateCommitStrategyButtonItem";
import useCommits from "./hooks/useCommits";

export type TCommit = {
  message: string;
  commitStrategy: EnumCommitStrategy;
  selectedService: string;
};

const INITIAL_VALUES: TCommit = {
  message: "",
  commitStrategy: EnumCommitStrategy.All,
  selectedService: null,
};

type Props = {
  projectId: string;
  noChanges: boolean;
  showCommitMessage?: boolean;
  commitMessage?: string;
  commitBtnType: CommitBtnType;
  resourceTypeGroup: EnumResourceTypeGroup;
};
const CLASS_NAME = "commit";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

export enum CommitBtnType {
  Button = "button",
  JumboButton = "jumboButton",
}

export type commitStrategyOption = {
  strategyType: EnumCommitStrategy;
  label: string;
};

const COMMIT_STRATEGY_OPTIONS: commitStrategyOption[] = [
  {
    strategyType: EnumCommitStrategy.All,
    label: "All services",
  },
  {
    strategyType: EnumCommitStrategy.AllWithPendingChanges,
    label: "Pending changes (default)",
  },
  {
    strategyType: EnumCommitStrategy.Specific,
    label: "Specific service",
  },
];

const Commit = ({
  projectId,
  resourceTypeGroup,
  noChanges,
  commitBtnType,
  showCommitMessage = true,
}: Props) => {
  const formikRef = useRef(null);
  const { isPlatformConsole } = useProjectBaseUrl();

  const { currentProject, resources } = useContext(AppContext);

  const commitableResources = useMemo(() => {
    return resources.filter(
      (r) =>
        r.resourceType === EnumResourceType.Service ||
        r.resourceType === EnumResourceType.MessageBroker ||
        r.resourceType === EnumResourceType.Component
    );
  }, [resources]);

  const [specificServiceSelected, setSpecificServiceSelected] =
    useState<boolean>();

  const { commitChangesLoading, commitChanges, bypassLimitations } =
    useCommits(projectId);
  const { pendingChanges } = usePendingChanges(
    currentProject,
    isPlatformConsole
      ? EnumResourceTypeGroup.Platform
      : EnumResourceTypeGroup.Services
  );

  const handleSubmit = useCallback((data, { resetForm }) => {
    resetForm(INITIAL_VALUES);
  }, []);

  const handleCommitBtnClicked = useCallback(() => {
    formikRef.current.submitForm();
  }, []);

  const handleSpecificServiceSelectedDismiss = useCallback(() => {
    setSpecificServiceSelected(false);
  }, [setSpecificServiceSelected]);

  const handleCommit = useCallback(
    (
      message: string,
      commitStrategy: EnumCommitStrategy,
      selectedServiceId?: string
    ) => {
      commitChanges({
        message: message,
        project: { connect: { id: currentProject?.id } },
        bypassLimitations: bypassLimitations ?? false,
        commitStrategy: commitStrategy,
        resourceIds: selectedServiceId ? [selectedServiceId] : null,
        resourceTypeGroup,
      });

      formikRef.current.submitForm();
    },
    [bypassLimitations, commitChanges, currentProject?.id, resourceTypeGroup]
  );

  const handleOnSpecificServiceCommit = useCallback(
    (serviceId: string) => {
      handleCommit(
        formikRef.current?.values?.message,
        EnumCommitStrategy.Specific,
        serviceId
      );
      handleSpecificServiceSelectedDismiss();
    },
    [handleCommit, handleSpecificServiceSelectedDismiss]
  );

  const handleOnSelectCommitStrategyChange = useCallback(
    (strategyType: EnumCommitStrategy) => {
      formikRef.current.values.commitStrategy = strategyType;
      if (strategyType === EnumCommitStrategy.Specific) {
        setSpecificServiceSelected(true);
        return;
      }

      handleCommit(
        formikRef.current?.values?.message,
        formikRef.current?.values?.commitStrategy,
        null
      );
    },
    [handleCommit]
  );

  const hasPendingChanges = pendingChanges?.length > 0;

  return (
    <>
      <Dialog
        title="Please Select a service to generate"
        isOpen={specificServiceSelected}
        onDismiss={handleSpecificServiceSelectedDismiss}
      >
        <FlexItem
          direction={EnumFlexDirection.Column}
          itemsAlign={EnumItemsAlign.Start}
        >
          {commitableResources
            .filter(
              (r) =>
                r.resourceType === EnumResourceType.Service ||
                r.resourceType === EnumResourceType.Component
            )
            .map((resource, index) => (
              <Button
                key={index}
                buttonStyle={EnumButtonStyle.Text}
                onClick={() => {
                  handleOnSpecificServiceCommit(resource.id);
                }}
              >
                <FlexItem direction={EnumFlexDirection.Row}>
                  <ResourceTypeBadge resource={resource} size="small" />
                  {resource.name}
                </FlexItem>
              </Button>
            ))}
        </FlexItem>
      </Dialog>
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
                {showCommitMessage &&
                  resourceTypeGroup !== EnumResourceTypeGroup.Platform && (
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

                <div>
                  <FlexItem
                    direction={EnumFlexDirection.Row}
                    itemsAlign={EnumItemsAlign.Center}
                    gap={EnumGapSize.None}
                  >
                    <CommitButton
                      commitMessage={formikRef.current?.values?.message}
                      onCommitChanges={handleCommitBtnClicked}
                      resourceTypeGroup={resourceTypeGroup}
                      hasPendingChanges={hasPendingChanges}
                      hasMultipleServices={commitableResources.length > 1}
                      onCommitSpecificService={() => {
                        handleOnSelectCommitStrategyChange(
                          EnumCommitStrategy.Specific
                        );
                      }}
                    ></CommitButton>
                    {resourceTypeGroup === EnumResourceTypeGroup.Services && (
                      <SelectMenu
                        title=""
                        icon="chevron_down"
                        buttonStyle={EnumButtonStyle.Text}
                        className={`${CLASS_NAME}__commit-strategy`}
                      >
                        <SelectMenuModal align="right" withCaret>
                          <SelectMenuList>
                            {COMMIT_STRATEGY_OPTIONS.map((item, index) => (
                              <CreateCommitStrategyButtonItem
                                key={index}
                                item={item}
                                hasPendingChanges={hasPendingChanges}
                                onCommitStrategySelected={
                                  handleOnSelectCommitStrategyChange
                                }
                              ></CreateCommitStrategyButtonItem>
                            ))}
                          </SelectMenuList>
                        </SelectMenuModal>
                      </SelectMenu>
                    )}
                  </FlexItem>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default Commit;
