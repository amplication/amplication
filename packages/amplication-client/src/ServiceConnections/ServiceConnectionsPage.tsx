import React, { useContext, useMemo } from "react";
import { match, useHistory } from "react-router-dom";
import { EmptyState } from "../Components/EmptyState";
import { EnumImages } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import * as models from "../models";
import { AppRouteProps } from "../routes/routesUtil";

import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import useServiceConnection from "./hooks/useServiceConnection";
import { ServiceConnectionsList } from "./ServiceConnectionsList";
import "./ServiceConnectionsPage.scss";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

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

  const { baseUrl } = useProjectBaseUrl();
  const history = useHistory();

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
          connection: data?.serviceTopicsList.find(
            (connection) => connection.messageBrokerId === resource.id
          ),
        };
      });
  }, [resources, data?.serviceTopicsList]);

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
        >
          <Button
            onClick={() => history.push(`${baseUrl}/create-broker`)}
            type="button"
            buttonStyle={EnumButtonStyle.Outline}
            iconSize="xsmall"
          >
            <span className={"add-broker__label"}>Add Message Broker</span>
          </Button>
        </EmptyState>
      )}
    </PageContent>
  );
};

export default TopicsPage;
