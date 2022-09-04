import { CircularProgress, Snackbar } from "@amplication/design-system";
import { isEmpty } from "lodash";
import React, { useContext, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import * as models from "../models";
import { formatError } from "../util/error";
import "./ServiceConnectionsList.scss";
import useServiceConnection from "./hooks/useServiceConnection";

type MessageBrokerListItem = {
  resource: models.Resource;
  connection: models.ServiceMessageBrokerConnection | undefined;
};

const CLASS_NAME = "service-connections-list";

type Props = {
  resourceId: string;
  selectFirst?: boolean;
};

export const ServiceConnectionsList = React.memo(
  ({ resourceId, selectFirst = false }: Props) => {
    const { currentWorkspace, currentProject, resources } = useContext(
      AppContext
    );

    const history = useHistory();

    const {
      serviceMessageBrokerConnections: data,
      loadingServiceMessageBrokerConnections: loading,
      errorServiceMessageBrokerConnections: error,
    } = useServiceConnection(resourceId);

    const errorMessage = formatError(error);

    const messageBrokerList = useMemo((): MessageBrokerListItem[] => {
      return resources
        .filter(
          (resource) =>
            resource.resourceType === models.EnumResourceType.MessageBroker
        )
        .map(
          (resource): MessageBrokerListItem => {
            return {
              resource,
              connection: data?.ServiceMessageBrokerConnections.find(
                (connection) => connection.messageBrokerId === resource.id
              ),
            };
          }
        );
    }, [resources, data?.ServiceMessageBrokerConnections]);

    useEffect(() => {
      if (selectFirst && !isEmpty(messageBrokerList)) {
        const resource = messageBrokerList[0].resource;
        const connectionUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/service-connections/${resource.id}`;
        history.push(connectionUrl);
      }
    }, [
      messageBrokerList,
      selectFirst,
      resourceId,
      history,
      currentWorkspace,
      currentProject,
    ]);

    return (
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__header`}>Message Brokers</div>
        {loading && <CircularProgress />}
        <div className={`${CLASS_NAME}__list`}>
          {messageBrokerList.map((connection) => (
            <div
              key={connection.resource.id}
              className={`${CLASS_NAME}__list__item`}
            >
              <InnerTabLink
                icon="connection"
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/service-connections/${connection.resource.id}`}
              >
                <span>{connection.resource.name}</span>
                <span>{connection.connection?.enabled ? "yes" : "no"}</span>
              </InnerTabLink>
            </div>
          ))}
        </div>

        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    );
  }
);
