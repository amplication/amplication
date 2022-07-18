import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./CreateServiceWizardForm.scss";
import {
  RadioButtonField,
  Snackbar,
  ToggleField,
} from "@amplication/design-system";
import { Form, Formik } from "formik";
import FormikAutoSave from "../../util/formikAutoSave";
import { useTracking } from "react-tracking";
import { gql, useMutation } from "@apollo/client";
import {
  sampleServiceResourceWithEntities,
  sampleServiceResourceWithoutEntities,
} from "../constants";
import { GET_RESOURCES } from "../../Workspaces/ResourceList";
import * as models from "../../models";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import ProgressBar from "../../Components/ProgressBar";
import { useHistory } from "react-router-dom";
import { formatError } from "../../util/error";

const CLASS_NAME = "create-service-wizard-form";

type Props = {
  isClicked: boolean;
};

type serviceSettings = {
  generateAdminUI: boolean;
  generateGraphQL: boolean;
  generateRestApi: boolean;
  resourceType: string;
};

type TData = {
  createResourceWithEntities: models.Resource;
  createResourceGenSettings: models.ResourceGenSettingsCreateInput;
};

export const CreateServiceWizardForm = ({ isClicked }: Props) => {
  const { trackEvent } = useTracking();

  const [generalError, setGeneralError] = useState<Error | undefined>(
    undefined
  );

  const clearGeneralError = useCallback(() => {
    setGeneralError(undefined);
  }, [setGeneralError]);

  const history = useHistory();

  const serviceSettingsFieldsInitValues = {
    generateAdminUI: true,
    generateGraphQL: true,
    generateRestApi: true,
    resourceType: "scratch",
  };

  const serviceSettingsFields: MutableRefObject<serviceSettings> = useRef(
    serviceSettingsFieldsInitValues
  );

  const [createResourceWithEntities, { loading, data, error }] = useMutation<
    TData
  >(CREATE_RESOURCE_WITH_ENTITIES, {
    update(cache, { data }) {
      if (!data) return;

      const queryData = cache.readQuery<{ resources: Array<models.Resource> }>({
        query: GET_RESOURCES,
      });
      if (queryData === null) {
        return;
      }
      cache.writeQuery({
        query: GET_RESOURCES,
        data: {
          resources: queryData.resources.concat([
            data.createResourceWithEntities,
          ]),
        },
      });
    },
  });

  const handleSubmit = (data: serviceSettings) => {
    if (!data.generateGraphQL) data.generateAdminUI = false;
    serviceSettingsFields.current = data;
  };

  const errorMessage = formatError(error) || formatError(generalError);

  const handleStartFromSample = useCallback(() => {
    trackEvent({
      eventName: "createResourceFromSample",
    });
    sampleServiceResourceWithEntities.generationSettings = {
      generateAdminUI: serviceSettingsFields.current.generateAdminUI,
      generateGraphQL: serviceSettingsFields.current.generateGraphQL,
      generateRestApi: serviceSettingsFields.current.generateRestApi,
    };

    createResourceWithEntities({
      variables: { data: sampleServiceResourceWithEntities },
    }).catch(console.error);
  }, [createResourceWithEntities, trackEvent, serviceSettingsFields]);

  const handleStartFromScratch = useCallback(() => {
    trackEvent({
      eventName: "createResourceFromScratch",
    });

    sampleServiceResourceWithoutEntities.generationSettings = {
      generateAdminUI: serviceSettingsFields.current.generateAdminUI,
      generateGraphQL: serviceSettingsFields.current.generateGraphQL,
      generateRestApi: serviceSettingsFields.current.generateRestApi,
    };

    createResourceWithEntities({
      variables: { data: sampleServiceResourceWithoutEntities },
    }).catch(console.error);
  }, [createResourceWithEntities, trackEvent, serviceSettingsFields]);

  useEffect(() => {
    if (isClicked) {
      const currentResourceType = serviceSettingsFields.current.resourceType;
      if (currentResourceType === "scratch") {
        handleStartFromScratch();
      } else if (currentResourceType === "sample") {
        handleStartFromSample();
      } else {
        //error?
      }
    }
  }, [handleStartFromScratch, handleStartFromSample, isClicked]);

  useEffect(() => {
    if (data) {
      const resourceId = data.createResourceWithEntities.id;

      history.push(`/${resourceId}`);
    }
  }, [history, data]);

  return (
    <div className={CLASS_NAME}>
      {loading ? (
        <div className={`${CLASS_NAME}__processing`}>
          <div className={`${CLASS_NAME}__processing__title`}>
            All set! We’re currently generating your service.
          </div>
          <div className={`${CLASS_NAME}__processing__message`}>
            It should only take a few seconds to finish. Don't go away!
          </div>
          <SvgThemeImage image={EnumImages.Generating} />
          <div className={`${CLASS_NAME}__processing__loader`}>
            <ProgressBar />
          </div>
          <div className={`${CLASS_NAME}__processing__tagline`}>
            For a full experience, connect with a GitHub repository and get a
            new Pull Request every time you make changes in your data model.
          </div>
        </div>
      ) : (
        <Formik
          initialValues={serviceSettingsFieldsInitValues}
          // validate={(values: serviceSettings) =>
          //   validate(values, FORM_SCHEMA)
          //}
          onSubmit={handleSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <div className={`${CLASS_NAME}__generationSettings`}>
                  <FormikAutoSave debounceMS={200} />
                  <div className={`${CLASS_NAME}__generation_setting_wrapper`}>
                    <label>APIs Admin UI Settings </label>
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
                  <div
                    className={`${CLASS_NAME}__generation_setting_resource_wrapper`}
                  >
                    <label>Sample Entities </label>
                    <div>
                      <RadioButtonField
                        label="None (start from scratch)"
                        value="scratch"
                        name="resourceType"
                        checked={formik.values.resourceType === "scratch"}
                      />
                      <RadioButtonField
                        label="Order Management"
                        value="sample"
                        name="resourceType"
                        checked={formik.values.resourceType === "sample"}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
      <Snackbar
        open={Boolean(error) || Boolean(generalError)}
        message={errorMessage}
        onClose={clearGeneralError}
      />
    </div>
  );
};

const CREATE_RESOURCE_WITH_ENTITIES = gql`
  mutation createResourceWithEntities($data: ResourceCreateWithEntitiesInput!) {
    createResourceWithEntities(data: $data) {
      id
      name
      description
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
      }
    }
  }
`;
