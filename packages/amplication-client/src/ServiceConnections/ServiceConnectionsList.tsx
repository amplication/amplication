import { CircularProgress, Snackbar } from "@amplication/ui/design-system";
import { ApolloError } from "@apollo/client";
import { isEmpty } from "lodash";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import "./ServiceConnectionsList.scss";
import ServiceConnectionsListItem from "./ServiceConnectionsListItem";

type MessageBrokerListItem = {
  resource: models.Resource;
  connection: models.ServiceTopics | undefined;
};

const CLASS_NAME = "service-connections-list";

type Props = {
  resourceId: string;
  messageBrokerList: MessageBrokerListItem[];
  error: ApolloError | undefined;
  loading: boolean;
  selectFirst?: boolean;
};

export const ServiceConnectionsList = React.memo(
  ({
    resourceId,
    messageBrokerList,
    loading,
    error,
    selectFirst = false,
  }: Props) => {
    const { currentWorkspace, currentProject } = useContext(AppContext);
    const history = useHistory();
    const errorMessage = formatError(error);

    useEffect(() => {
      if (selectFirst && !isEmpty(messageBrokerList)) {
        const resource = messageBrokerList[0].resource;
        const connectionUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/service-connections/${resource.id}`;
        history.push(connectionUrl);
      }
    }, [selectFirst, resourceId, history, currentWorkspace, currentProject]);

    return (
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__header`}>Message Brokers</div>
        {loading && <CircularProgress />}
        <div className={`${CLASS_NAME}__list`}>
          {messageBrokerList.map((connection, index) => {
            if (!currentProject?.id || !currentWorkspace?.id) {
              return null;
            }

            return (
              <ServiceConnectionsListItem
                key={index}
                currentProjectId={currentProject.id}
                currentWorkspaceId={currentWorkspace.id}
                enabled={connection.connection?.enabled || false}
                resourceId={resourceId}
                connectionResource={connection.resource}
              />
            );
          })}
        </div>

        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    );
  }
);
