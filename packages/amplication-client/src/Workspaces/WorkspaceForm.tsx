import { useCallback, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { Formik, Form } from "formik";
import {
  validate,
  validationErrorMessages,
} from "../util/formikValidateJsonSchema";
import * as models from "../models";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import { TextField, Snackbar } from "@amplication/ui/design-system";
import { useTracking } from "../util/analytics";
import "./WorkspaceForm.scss";
import { AppContext } from "../context/appContext";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import PageContent from "../Layout/PageContent";

type TData = {
  updateWorkspace: models.Workspace;
};

const { AT_LEAST_TWO_CHARARCTERS } = validationErrorMessages;

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
  },
  errorMessage: {
    properties: {
      name: AT_LEAST_TWO_CHARARCTERS,
    },
  },
};

const CLASS_NAME = "workspace-form";

const PAGE_TITLE = "Workspace Settings";

function WorkspaceForm() {
  const { currentWorkspace } = useContext(AppContext);

  const { trackEvent } = useTracking();

  const [updateWorkspace, { error: updateError }] =
    useMutation<TData>(UPDATE_WORKSPACE);

  const handleSubmit = useCallback(
    (newData) => {
      const { name } = newData;
      trackEvent({
        eventName: AnalyticsEventNames.WorkspaceInfoUpdate,
      });
      currentWorkspace &&
        updateWorkspace({
          variables: {
            data: {
              name,
            },
            workspaceId: currentWorkspace.id,
          },
        }).catch(console.error);
    },
    [trackEvent, currentWorkspace, updateWorkspace]
  );

  const errorMessage = formatError(updateError);

  return (
    <PageContent className={CLASS_NAME} pageTitle={PAGE_TITLE}>
      <h2>Workspace Settings</h2>
      <div className={`${CLASS_NAME}__separator`} />
      {currentWorkspace && (
        <Formik
          initialValues={currentWorkspace}
          validate={(values: models.Workspace) => validate(values, FORM_SCHEMA)}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <FormikAutoSave debounceMS={1000} />
                <TextField name="name" label="Workspace Name" />
              </Form>
            );
          }}
        </Formik>
      )}
      <label className={`${CLASS_NAME}__label`}>Workspace ID </label>
      {currentWorkspace && <div>{currentWorkspace.id}</div>}

      <Snackbar open={Boolean(errorMessage)} message={errorMessage} />
    </PageContent>
  );
}

export default WorkspaceForm;

const UPDATE_WORKSPACE = gql`
  mutation updateWorkspace(
    $data: WorkspaceUpdateInput!
    $workspaceId: String!
  ) {
    updateWorkspace(data: $data, where: { id: $workspaceId }) {
      id
      name
    }
  }
`;
