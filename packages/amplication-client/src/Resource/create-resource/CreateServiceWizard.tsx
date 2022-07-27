import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Snackbar,
} from "@amplication/design-system";
import { gql, useMutation } from "@apollo/client";
import React, { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { match, useHistory } from "react-router-dom";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import "./CreateServiceWizard.scss";
import {
  CreateServiceWizardForm,
  serviceSettings,
} from "./CreateServiceWizardForm";
import * as models from "../../models";
import { createResource, serviceSettingsFieldsInitValues } from "../constants";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import ProgressBar from "../../Components/ProgressBar";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import { GET_RESOURCES } from "../../Workspaces/queries/resourcesQueries";

type Props = {
  match: match<{
    workspace: string;
    project: string;
  }>;
  moduleClass: string;
};

type TData = {
  createResourceWithEntities: models.Resource;
};

const CreateServiceWizard: React.FC<Props> = ({ moduleClass, match }) => {
  const { workspace, project } = match.params;
  const serviceSettingsFields: MutableRefObject<serviceSettings> = useRef(
    serviceSettingsFieldsInitValues
  );

  const { trackEvent } = useTracking();
  const history = useHistory();
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

  const errorMessage = formatError(error);

  const createStarterResource = useCallback(
    (data: models.ResourceCreateWithEntitiesInput, eventName: string) => {
      trackEvent({
        eventName: eventName,
      });
      createResourceWithEntities({
        variables: { data: data },
      }).catch(console.error);
    },
    [createResourceWithEntities, trackEvent]
  );

  useEffect(() => {
    if (data) {
      const resource = data.createResourceWithEntities;
      history.push(`/${workspace}/${project}/${resource.id}`);
    }
  }, [history, data, project, workspace]);

  const handleSubmitResource = (currentServiceSettings: serviceSettings) => {
    serviceSettingsFields.current = currentServiceSettings;
  };

  const handleClick = () => {
    if (!serviceSettingsFields) return;
    const {
      generateAdminUI,
      generateGraphQL,
      generateRestApi,
    } = serviceSettingsFields.current;

    const isResourceWithEntities =
      serviceSettingsFields.current.resourceType === "sample";

    const resource = createResource(
      project,
      isResourceWithEntities,
      generateAdminUI,
      generateGraphQL,
      generateRestApi
    );

    createStarterResource(
      resource,
      isResourceWithEntities
        ? "createResourceFromSample"
        : "createResourceFromScratch"
    );
  };

  return (
    <div className={moduleClass}>
      {loading ? (
        <div className={`${moduleClass}__processing`}>
          <div className={`${moduleClass}__processing__title`}>
            All set! We’re currently generating your service.
          </div>
          <div className={`${moduleClass}__processing__message`}>
            It should only take a few seconds to finish. Don't go away!
          </div>
          <SvgThemeImage image={EnumImages.Generating} />
          <div className={`${moduleClass}__processing__loader`}>
            <ProgressBar />
          </div>
          <div className={`${moduleClass}__processing__tagline`}>
            For a full experience, connect with a GitHub repository and get a
            new Pull Request every time you make changes in your data model.
          </div>
        </div>
      ) : (
        <div className={`${moduleClass}__splitWrapper`}>
          <div className={`${moduleClass}__left`}>
            <div className={`${moduleClass}__description`}>
              <ResourceCircleBadge type="service" />
              <h3>Amplication Resource Creation Wizard</h3>
              <h2>Let’s start building your app</h2>
              <h3>
                Select which components to include in your app and whether to
                use sample entities
              </h3>
            </div>
          </div>
          <div className={`${moduleClass}__right`}>
            <CreateServiceWizardForm
              handleSubmitResource={handleSubmitResource}
            />
          </div>
        </div>
      )}
      <div className={`${moduleClass}__footer`}>
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          disabled
          icon="arrow_left"
          iconPosition={EnumIconPosition.Left}
        >
          {"Back to project"}
        </Button>
        <Button buttonStyle={EnumButtonStyle.Primary} onClick={handleClick}>
          <label>Create Service</label>
        </Button>
      </div>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default CreateServiceWizard;

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
