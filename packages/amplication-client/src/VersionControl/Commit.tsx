import {
  Button,
  Dialog,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
  MultiStateToggle,
  RadioButtonField,
  SelectMenu,
  SelectMenuList,
  SelectMenuModal,
  TextField,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback, useContext, useRef, useState } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { EnumCommitStrategy, EnumResourceType } from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./Commit.scss";
import useAvailableCodeGenerators from "../Workspaces/hooks/useAvailableCodeGenerators";
import useCommits from "./hooks/useCommits";
import CreateCommitStrategyButtonItem from "./CreateCommitStrategyButtonItem";
import "./CreateCommitStrategyButton.scss";
import usePendingChanges from "../Workspaces/hooks/usePendingChanges";
import CommitButton from "./CommitButton";

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
  const formikRef = useRef(null);

  const { dotNetGeneratorEnabled } = useAvailableCodeGenerators();

  const { currentWorkspace, currentProject, resources } =
    useContext(AppContext);

  const [specificServiceSelected, setSpecificServiceSelected] =
    useState<boolean>();

  const { commitChangesLoading } = useCommits(projectId);
  const { pendingChanges } = usePendingChanges(currentProject);

  const handleSubmit = useCallback((data, { resetForm }) => {
    resetForm(INITIAL_VALUES);
  }, []);

  const handleCommitBtnClicked = useCallback(() => {
    formikRef.current.submitForm();
  }, []);

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
              {commitBtnType === CommitBtnType.Button ? (
                <div>
                  <FlexItem
                    direction={EnumFlexDirection.Row}
                    itemsAlign={EnumItemsAlign.Center}
                    gap={EnumGapSize.None}
                  >
                    <CommitButton
                      commitBtnType={commitBtnType}
                      commitMessage={formikRef.current?.values?.message}
                      onCommitChanges={handleCommitBtnClicked}
                    ></CommitButton>
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
                <CommitButton
                  commitBtnType={commitBtnType}
                  commitMessage={formikRef.current?.values?.message}
                  onCommitChanges={handleCommitBtnClicked}
                ></CommitButton>
              ) : null}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Commit;
