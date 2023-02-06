import { EnumResourceType } from "@amplication/code-gen-types/models";
import { CircleBadge } from "@amplication/design-system";
import { gql, useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { match } from "react-router-dom";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";
import { resourceThemeMap } from "./constants";
import DocsTile from "./DocsTile";
import EntitiesTile from "./EntitiesTile";
import FeatureRequestTile from "./FeatureRequestTile";
import NewVersionTile from "./NewVersionTile";
import OverviewTile from "./OverviewTile";
import "./ResourceHome.scss";
import ResourceMenu from "./ResourceMenu";
import RolesTile from "./RolesTile";
import SyncWithGithubTile from "./SyncWithGithubTile";
import ViewCodeViewTile from "./ViewCodeViewTile";
import { TopicsTile } from "./TopicsTile";
import { ServicesTile } from "./ServicesTile";
import { Field, Form, Formik } from "formik";
import FormikAutoSave from "../util/formikAutoSave";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import * as models from "../models";
import { UPDATE_RESOURCE } from "../Workspaces/queries/resourcesQueries";
import { GET_PROJECTS } from "../Workspaces/queries/projectQueries";
import { formatError } from "../util/error";
import { Icon } from "@amplication/design-system";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

type TData = {
  updateResource: models.Resource;
};

const CLASS_NAME = "resource-home";

const ResourceHome = ({ match, innerRoutes }: Props) => {
  const resourceId = match.params.resource;
  const { currentResource } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showTick, setShowTick] = useState(false);

  const { trackEvent } = useTracking();
  const [updateResource, { error: updateError }] = useMutation<TData>(
    UPDATE_RESOURCE,
    {
      refetchQueries: [
        {
          query: GET_PROJECTS,
        },
      ],
    }
  );
  const errorMessage = formatError(updateError);

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleSubmit = (data) => {
    const { name } = data;
    trackEvent({
      eventName: AnalyticsEventNames.ResourceInfoUpdate,
    });
    updateResource({
      variables: {
        data: {
          name,
        },
        resourceId: resourceId,
      },
    }).catch(console.error);
    setIsEditing(false);
    setShowTick(true);
    setTimeout(() => {
      setShowTick(false);
    }, 2000);
  };

  return (
    <>
      <ResourceMenu />
      {match.isExact && currentResource ? (
        <PageContent
          className={CLASS_NAME}
          sideContent=""
          pageTitle={currentResource?.name}
        >
          <div
            className={`${CLASS_NAME}__header`}
            style={{
              backgroundColor:
                resourceThemeMap[currentResource?.resourceType].color,
            }}
          >
            {currentResource?.resourceType === "ProjectConfiguration" ? (
              isEditing ? (
                <Formik
                  initialValues={{ name: currentResource?.name }}
                  onSubmit={handleSubmit}
                >
                  {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                      <FormikAutoSave debounceMS={1000} />
                      <Field name="name" as="input" onBlur={handleBlur} />
                    </Form>
                  )}
                </Formik>
              ) : (
                <span
                  className={`${CLASS_NAME}__header-text`}
                  onClick={() => setIsEditing(true)}
                >
                  {currentResource?.name}
                  {showTick && <Icon icon={"check"} size="medium" />}
                </span>
              )
            ) : (
              currentResource?.name
            )}
            <CircleBadge
              name={currentResource?.name || ""}
              color={
                resourceThemeMap[currentResource?.resourceType].color ||
                "transparent"
              }
            />
          </div>
          <div className={`${CLASS_NAME}__tiles`}>
            <NewVersionTile resourceId={resourceId} />
            {currentResource?.resourceType === EnumResourceType.Service && (
              <OverviewTile resourceId={resourceId} />
            )}
            <SyncWithGithubTile resourceId={resourceId} />
            <ViewCodeViewTile resourceId={resourceId} />
            {currentResource?.resourceType === EnumResourceType.Service && (
              <EntitiesTile resourceId={resourceId} />
            )}
            {currentResource?.resourceType === EnumResourceType.Service && (
              <RolesTile resourceId={resourceId} />
            )}
            {currentResource?.resourceType ===
              EnumResourceType.MessageBroker && (
              <TopicsTile resourceId={resourceId} />
            )}
            {currentResource?.resourceType ===
              EnumResourceType.MessageBroker && (
              <ServicesTile resourceId={resourceId} />
            )}
            <DocsTile />
            <FeatureRequestTile />
          </div>
        </PageContent>
      ) : (
        innerRoutes
      )}
    </>
  );
};

export default ResourceHome;

export const GET_RESOURCE = gql`
  query getResource($id: String!) {
    resource(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      githubLastSync
      githubLastMessage
    }
  }
`;
