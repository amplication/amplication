import {
  EnumFlexDirection,
  EnumGapSize,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Snackbar,
  Text,
  TextField,
  ToggleField,
  Form,
  EnumFlexItemMargin,
  TabContentTitle,
  Panel,
  EnumPanelStyle,
} from "@amplication/ui/design-system";
import { gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import { useCallback, useContext } from "react";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import {
  validate,
  validationErrorMessages,
} from "../util/formikValidateJsonSchema";
import { BillingFeature } from "@amplication/util-billing-types";
import { useStiggContext } from "@stigg/react-sdk";
import "./WorkspaceForm.scss";

type TData = {
  updateWorkspace: models.Workspace;
};

const { AT_LEAST_TWO_CHARACTERS } = validationErrorMessages;

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
    allowLLMFeatures: {
      type: "boolean",
    },
  },
  errorMessage: {
    properties: {
      name: AT_LEAST_TWO_CHARACTERS,
    },
  },
};

const CLASS_NAME = "workspace-form";

const PAGE_TITLE = "Workspace Settings";

function WorkspaceForm() {
  const { currentWorkspace } = useContext(AppContext);

  const { trackEvent } = useTracking();
  const { stigg } = useStiggContext();

  const hasRedesignArchitectureFeature = stigg.getBooleanEntitlement({
    featureId: BillingFeature.RedesignArchitecture,
  }).hasAccess;

  const [updateWorkspace, { error: updateError }] =
    useMutation<TData>(UPDATE_WORKSPACE);

  const handleSubmit = useCallback(
    (newData) => {
      const { name, allowLLMFeatures } = newData;
      trackEvent({
        eventName: AnalyticsEventNames.WorkspaceInfoUpdate,
      });
      currentWorkspace &&
        updateWorkspace({
          variables: {
            data: {
              name,
              allowLLMFeatures,
            },
            workspaceId: currentWorkspace.id,
          },
        }).catch(console.error);
    },
    [trackEvent, currentWorkspace, updateWorkspace]
  );

  const errorMessage = formatError(updateError);

  return (
    <div className={CLASS_NAME}>
      <Text textStyle={EnumTextStyle.H4}>Workspace Settings</Text>
      <FlexItem
        direction={EnumFlexDirection.Row}
        margin={EnumFlexItemMargin.Top}
      >
        <Text textStyle={EnumTextStyle.Label}>ID: </Text>
        <Text textStyle={EnumTextStyle.Label}>{currentWorkspace?.id}</Text>
      </FlexItem>

      <HorizontalRule />

      {currentWorkspace && (
        <Formik
          initialValues={currentWorkspace}
          validate={(values: models.Workspace) => validate(values, FORM_SCHEMA)}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {(formik) => {
            return (
              <Form childrenAsBlocks>
                <FormikAutoSave debounceMS={1000} />
                <TextField name="name" label="Workspace Name" />
                <div>
                  <TabContentTitle title="AI-powered features" />
                  <Panel panelStyle={EnumPanelStyle.Bordered}>
                    <Text textStyle={EnumTextStyle.Tag}>
                      <FlexItem
                        direction={EnumFlexDirection.Column}
                        gap={EnumGapSize.Small}
                      >
                        <div>
                          Manage Amplication AI-powered features and
                          enable/disable advanced features using artificial
                          intelligence. These include personalized
                          recommendations, and automation of tasks.
                        </div>
                        <div>
                          Note: This may involve processing your data with AI
                          technologies while keeping your data secure. When
                          disabled, we will never share your data with any AI or
                          large language model services.
                        </div>
                      </FlexItem>
                    </Text>
                  </Panel>

                  <ToggleField
                    name="allowLLMFeatures"
                    label="Enable AI-powered features"
                    disabled={!hasRedesignArchitectureFeature}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      )}

      <Snackbar open={Boolean(errorMessage)} message={errorMessage} />
    </div>
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
      allowLLMFeatures
    }
  }
`;
