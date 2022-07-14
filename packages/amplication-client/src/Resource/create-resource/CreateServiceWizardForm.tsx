import React, { useCallback, useEffect, useState } from "react";
import "./CreateServiceWizardForm.scss";
import {
  Button,
  EnumButtonStyle,
  RadioButtonField,
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

const CLASS_NAME = "create-service-wizard-form";

type resourceType = {
  scratch: boolean;
  sample: boolean;
};

type serviceSettings = {
  generateAdminUI: boolean;
  generateGraphQL: boolean;
  generateRestApi: boolean;
  resourceType: resourceType;
};

type TData = {
  createResourceWithEntities: models.Resource;
};

export const CreateServiceWizardForm = () => {
  
  const { trackEvent } = useTracking();
  const history = useHistory();
  const [serviceSettingsFields, setServiceSettings] = useState<serviceSettings>(
    {
      generateAdminUI: true,
      generateGraphQL: true,
      generateRestApi: true,
      resourceType: {
        scratch: true,
        sample: false,
      },
    }
  );

  const [createResourceWithEntities, { loading,data }] = useMutation<
    // todo:: return error
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

  const handleSubmit = useCallback(
    (data: serviceSettings) => {
      if (!data.generateGraphQL) data.generateAdminUI = false;
      setServiceSettings(data);
    },
    [setServiceSettings]
  );

  //const errorMessage = formatError(error) || formatError(generalError);

  const handleStartFromSample = useCallback(() => {
    trackEvent({
      eventName: "createResourceFromSample",
    });
    createResourceWithEntities({
      variables: { data: sampleServiceResourceWithEntities },
    }).catch(console.error);
  }, [createResourceWithEntities, trackEvent]);

  const handleStartFromScratch = useCallback(() => {
    trackEvent({
      eventName: "createResourceFromScratch",
    });
    createResourceWithEntities({
      variables: { data: sampleServiceResourceWithoutEntities },
    }).catch(console.error);
  }, [createResourceWithEntities, trackEvent]);

  const handleClick = useCallback(() => {
    if (serviceSettingsFields.resourceType.scratch) {
      handleStartFromScratch();
    } else if (serviceSettingsFields.resourceType.sample) {
      handleStartFromSample();
    } else {
      //error?
    }
  }, [serviceSettingsFields, handleStartFromScratch, handleStartFromSample]);

  const handleChange = useCallback(
    (event) => {
      serviceSettingsFields.resourceType.sample = !serviceSettingsFields
        .resourceType.sample;
      serviceSettingsFields.resourceType.scratch = !serviceSettingsFields
        .resourceType.scratch;
      setServiceSettings(serviceSettingsFields);
    },
    [serviceSettingsFields]
  );

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
        serviceSettingsFields && (
          <Formik
            initialValues={serviceSettingsFields}
            // validate={(values: serviceSettings) =>
            //   validate(values, FORM_SCHEMA)
            //}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <div className={`${CLASS_NAME}__generationSettings`}>
                    <label>APIs Admin UI Settings </label>
                    <div
                      className={`${CLASS_NAME}__generation_setting_wrapper`}
                    >
                      <FormikAutoSave debounceMS={200} />
                      <div className={`${CLASS_NAME}__toggle_wrapper`}>
                        <ToggleField
                          name="generateGraphQL"
                          label="GraphQL API"
                        />
                        <ToggleField
                          name="generateRestApi"
                          label="REST API & Swagger UI"
                        />
                        <ToggleField
                          disabled={!serviceSettingsFields.generateGraphQL}
                          name="generateAdminUI"
                          label="Admin UI"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`${CLASS_NAME}__SampleSettings`}>
                    <label>Sample Entities </label>
                    <div
                      className={`${CLASS_NAME}__generation_setting_wrapper`}
                    >
                      <div className={`${CLASS_NAME}__toggle_wrapper`}>
                        <RadioButtonField
                          className=""
                          label="None (start from scratch)"
                          name="scratch"
                          checked={serviceSettingsFields.resourceType.scratch}
                          onChange={handleChange}
                        />
                        <RadioButtonField
                          className=""
                          label="Order Management"
                          name="sample"
                          checked={serviceSettingsFields.resourceType.sample}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        )
      )}
      {/* <Snackbar
        open={Boolean(error)}
        message={formatError(error || updateError)}
      /> */}
      <footer>
        <Button buttonStyle={EnumButtonStyle.Primary} onClick={handleClick}>
          {"create resource"}
        </Button>
      </footer>
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
