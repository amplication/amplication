import React, { useContext, useMemo } from "react";
import { match } from "react-router-dom";
import * as models from "../models";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import { AppRouteProps } from "../routes/routesUtil";

import useServiceConnection from "./hooks/useServiceConnection";
import { ServiceConnectionsList } from "./ServiceConnectionsList";
import { isEmpty } from "lodash";

type MessageBrokerListItem = {
  resource: models.Resource;
  connection: models.ServiceTopics | undefined;
};

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const pageTitle = "Topics";

const TopicsPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const { resource: resourceId } = match.params;
  const {
    serviceTopicsList: data,
    loadingServiceTopics: loading,
    errorServiceTopics: error,
  } = useServiceConnection(resourceId);

  const { resources } = useContext(AppContext);

  const messageBrokerList = useMemo((): MessageBrokerListItem[] => {
    return resources
      .filter(
        (resource) =>
          resource.resourceType === models.EnumResourceType.MessageBroker
      )
      .map((resource): MessageBrokerListItem => {
        return {
          resource,
          connection: data?.ServiceTopicsList.find(
            (connection) => connection.messageBrokerId === resource.id
          ),
        };
      });
  }, [resources, data?.ServiceTopicsList]);

  const hasServiceTopicList = !isEmpty(messageBrokerList);

  return (
    <PageContent
      pageTitle={pageTitle}
      className="topics"
      sideContent={
        hasServiceTopicList ? (
          <ServiceConnectionsList
            resourceId={resourceId}
            messageBrokerList={messageBrokerList}
            loading={loading}
            error={error}
            selectFirst
          />
        ) : null
      }
    >
      {hasServiceTopicList ? (
        innerRoutes
      ) : (
        <EmptyState
          message="There is no message broker to show."
          image={EnumImages.MessageBrokerEmptyState}
        />
      )}
    </PageContent>
  );
};

export default TopicsPage;
