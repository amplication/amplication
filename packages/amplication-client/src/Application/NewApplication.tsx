import React, { useCallback, useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import { GlobalHotKeys } from "react-hotkeys";

import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { GET_APPLICATIONS } from "../Workspaces/ApplicationList";
import { formatError } from "../util/error";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { validate } from "../util/formikValidateJsonSchema";

import { TextField } from "@amplication/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import { SvgThemeImage, EnumImages } from "../Components/SvgThemeImage";
import "./NewApplication.scss";

type Values = {
  name: string;
  description: string;
};

type TData = {
  createApp: models.App;
};

const INITIAL_VALUES = {
  name: "",
  description: "",
};

const FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
    description: {
      type: "string",
    },
  },
};
const CLASS_NAME = "new-application";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const STEP_SELECT_TYPE = "step-select-type";
const STEP_START_FROM_SCRATCH = "step-start-from-scratch";

const NewApplication = () => {
  const { trackEvent } = useTracking();

  const [currentStep, setCurrentStep] = useState<string>(STEP_SELECT_TYPE);

  const StepStartFromScratch = useCallback(() => {
    setCurrentStep(STEP_START_FROM_SCRATCH);
    trackEvent({
      eventName: "createAppStep-startFromScratch",
    });
  }, [setCurrentStep, trackEvent]);

  const StepImportExcel = useCallback(() => {
    trackEvent({
      eventName: "createAppStep-importExcel",
    });
  }, [trackEvent]);

  const StepSelectType = useCallback(() => {
    setCurrentStep(STEP_SELECT_TYPE);
  }, [setCurrentStep]);

  const history = useHistory();
  const [createApp, { loading, data, error }] = useMutation<TData>(CREATE_APP, {
    onCompleted: (data) => {
      trackEvent({
        eventName: "createApp",
        appName: data.createApp.name,
      });
    },
    update(cache, { data }) {
      if (!data) return;
      const queryData = cache.readQuery<{ apps: Array<models.App> }>({
        query: GET_APPLICATIONS,
      });
      if (queryData === null) {
        return;
      }
      cache.writeQuery({
        query: GET_APPLICATIONS,
        data: {
          apps: queryData.apps.concat([data.createApp]),
        },
      });
    },
  });

  const handleSubmit = useCallback(
    (data: Values) => {
      createApp({ variables: { data } }).catch(console.error);
    },
    [createApp]
  );

  const errorMessage = formatError(error);

  useEffect(() => {
    if (data) {
      history.push(`/${data.createApp.id}`);
    }
  }, [history, data]);

  return (
    <div className={CLASS_NAME}>
      {currentStep === STEP_SELECT_TYPE ? (
        <div className={`${CLASS_NAME}__step1`}>
          <Link
            onClick={StepStartFromScratch}
            to=""
            className={`${CLASS_NAME}__step1__option`}
          >
            <SvgThemeImage image={EnumImages.AddApp} />
            <div className={`${CLASS_NAME}__step1__option__title`}>
              Start from scratch
            </div>
          </Link>
          <Link
            to="/create-app"
            onClick={StepImportExcel}
            className={`${CLASS_NAME}__step1__option`}
          >
            <SvgThemeImage image={EnumImages.ImportExcel} />
            <div className={`${CLASS_NAME}__step1__option__title`}>
              Import schema from Excel
            </div>
          </Link>
        </div>
      ) : (
        <div className={`${CLASS_NAME}__step2`}>
          <SvgThemeImage image={EnumImages.AddApp} />

          <div className={`${CLASS_NAME}__step2__form`}>
            <div className={`${CLASS_NAME}__step2__form__title`}>
              Start from scratch
            </div>
            <Formik
              initialValues={INITIAL_VALUES}
              validate={(values: Values) => validate(values, FORM_SCHEMA)}
              onSubmit={handleSubmit}
              validateOnMount
            >
              {(formik) => {
                const handlers = {
                  SUBMIT: formik.submitForm,
                };
                return (
                  <Form>
                    <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
                    <TextField
                      name="name"
                      label="Give your new app a descriptive name"
                      autoComplete="off"
                      disabled={loading}
                    />
                    <div className={`${CLASS_NAME}__step2__form__buttons`}>
                      <Button
                        buttonStyle={EnumButtonStyle.Primary}
                        disabled={!formik.isValid || loading}
                        type="submit"
                      >
                        Create App
                      </Button>
                      <Button
                        buttonStyle={EnumButtonStyle.Clear}
                        disabled={loading}
                        onClick={StepSelectType}
                        type="button"
                        className={`${CLASS_NAME}__step2__form__buttons__back`}
                      >
                        Back
                      </Button>
                      {loading && <CircularProgress />}
                    </div>

                    <Snackbar open={Boolean(error)} message={errorMessage} />
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewApplication;

const CREATE_APP = gql`
  mutation createApp($data: AppCreateInput!) {
    createApp(data: $data) {
      id
      name
      description
    }
  }
`;
