import { MultiStateToggle, TextField } from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback, useContext, useRef } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./Commit.scss";
import useAvailableCodeGenerators from "../Workspaces/hooks/useAvailableCodeGenerators";
import useCommits from "./hooks/useCommits";
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
};

const INITIAL_VALUES: TCommit = {
  message: "",
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

  const { currentWorkspace, currentProject } = useContext(AppContext);

  const { commitChangesLoading } = useCommits(projectId);

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
              <CommitButton
                commitBtnType={commitBtnType}
                commitMessage={formikRef.current?.values?.message}
                onCommitChanges={handleCommitBtnClicked}
              ></CommitButton>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Commit;
