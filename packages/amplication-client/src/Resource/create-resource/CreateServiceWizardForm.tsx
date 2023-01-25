import React, { useCallback } from "react";
import "./CreateServiceWizardForm.scss";
import { ToggleField } from "@amplication/design-system";
import { Form, Formik } from "formik";
import FormikAutoSave from "../../util/formikAutoSave";
import { serviceSettingsFieldsInitValues } from "../constants";

const CLASS_NAME = "create-service-wizard-form";

type Props = {
  handleSubmitResource: (serviceSettings: serviceSettings) => void;
};

export type serviceSettings = {
  generateAdminUI: boolean;
  generateGraphQL: boolean;
  generateRestApi: boolean;
  resourceType: string;
};

export const CreateServiceWizardForm = ({ handleSubmitResource }: Props) => {
  const handleSubmit = useCallback(
    (data: serviceSettings) => {
      if (!data.generateGraphQL) data.generateAdminUI = false;
      handleSubmitResource(data);
    },
    [handleSubmitResource]
  );

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={serviceSettingsFieldsInitValues}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          return (
            <Form>
              <div className={`${CLASS_NAME}__generationSettings`}>
                <FormikAutoSave debounceMS={200} />
                <div className={`${CLASS_NAME}__generation_setting_wrapper`}>
                  <p>APIs Admin UI Settings</p>
                  <div>
                    <ToggleField name="generateGraphQL" label="GraphQL API" />
                    <ToggleField
                      name="generateRestApi"
                      label="REST API & Swagger UI"
                    />
                    <ToggleField
                      disabled={!formik.values.generateGraphQL}
                      name="generateAdminUI"
                      label="Admin UI"
                    />
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
