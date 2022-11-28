import { Form, Formik } from "formik";
import React, { useCallback } from "react";
import FormikAutoSave from "../../util/formikAutoSave";
import { serviceSettingsFieldsInitValues } from "../constants";
import "./CreateMessageBrokerForm.scss";

const CLASS_NAME = "create-message-broker-form";

type Props = {
  handleSubmitResource: () => void;
};

export const CreateMessageBrokerForm = ({ handleSubmitResource }: Props) => {
  const handleSubmit = useCallback(() => {
    handleSubmitResource();
  }, [handleSubmitResource]);

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
                  <div>No Settings</div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
