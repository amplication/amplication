import React, { useCallback } from "react";
import { CircleBadge, Icon, ToggleField } from "@amplication/design-system";
import { Form, Formik } from "formik";
import FormikAutoSave from "../../util/formikAutoSave";
import { serviceSettingsFieldsInitValues } from "../constants";
import "./CreateServiceWizard.scss";

const CLASS_NAME = "create-service-wizard";

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
    <Formik
      initialValues={serviceSettingsFieldsInitValues}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        return (
          <Form>
            <div className={`${CLASS_NAME}__repo_wrapper`}>
              <FormikAutoSave debounceMS={200} />
              <div className={`${CLASS_NAME}__db_box`}>
                <div className={`${CLASS_NAME}__db_up_buttons`}>
                  <CircleBadge color={"black"} size={"small"}>
                    <Icon icon="" size={"small"} />
                  </CircleBadge>
                  <label>GraphQL API</label>
                  <ToggleField name="generateGraphQL" label="" />
                </div>
                <div className={`${CLASS_NAME}__db_up_buttons`}>
                  <CircleBadge color={"black"} size={"small"}>
                    <Icon icon="" size={"small"} />
                  </CircleBadge>
                  <label>REST API & Swagger UI</label>
                  <ToggleField name="generateRestApi" label="" />
                </div>
              </div>
              <div className={`${CLASS_NAME}__db_box`}>
                <div className={`${CLASS_NAME}__db_up_buttons`}>
                  <CircleBadge color={"black"} size={"small"}>
                    <Icon icon="" size={"small"} />
                  </CircleBadge>
                  <label>Admin UI</label>
                  <ToggleField name="generateAdminUI" label="" />
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
