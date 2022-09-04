import * as models from "../models";
import { HorizontalRule, Snackbar } from "@amplication/design-system";
import React, { useCallback, useMemo } from "react";
import { useRouteMatch } from "react-router-dom";
import useServiceConnection from "./hooks/useServiceConnection";
import ServiceMessageBrokerConnectionForm from "./ServiceMessageBrokerConnectionForm";
import { formatError } from "../util/error";

const CLASS_NAME = "service-message-broker-connection";

const ServiceMessageBrokerConnection = () => {
  const match = useRouteMatch<{
    resource: string;
    connectedResourceId: string;
  }>("/:workspace/:project/:resource/service-connections/:connectedResourceId");

  const { resource, connectedResourceId } = match?.params ?? {
    resource: "",
    connectedResourceId: "",
  };

  const {
    serviceMessageBrokerConnections: data,
    updateServiceMessageBrokerConnection: update,
    updateError,
    createServiceMessageBrokerConnection: create,
    createError,
  } = useServiceConnection(resource);

  const serviceMessageBrokerConnection = useMemo(() => {
    return data?.ServiceMessageBrokerConnections.find(
      (connection) => connection.messageBrokerId === connectedResourceId
    );
  }, [data, connectedResourceId]);

  const handleSubmit = useCallback(
    (data: models.ServiceMessageBrokerConnection) => {
      if (serviceMessageBrokerConnection?.id) {
        update({
          variables: {
            where: {
              id: serviceMessageBrokerConnection?.id,
            },
            data,
          },
        }).catch(console.error);
      } else {
        create({
          variables: {
            data: {
              ...data,
              displayName: connectedResourceId, //must be unique
              messageBrokerId: connectedResourceId,
              resource: {
                connect: {
                  id: resource,
                },
              },
            },
          },
        }).catch(console.error);
      }
    },
    [
      update,
      create,
      serviceMessageBrokerConnection,
      connectedResourceId,
      resource,
    ]
  );

  const errorMessage = formatError(updateError || createError);

  return (
    <div className={CLASS_NAME}>
      <HorizontalRule />
      {connectedResourceId}
      <ServiceMessageBrokerConnectionForm
        onSubmit={handleSubmit}
        defaultValues={serviceMessageBrokerConnection}
      />
      <Snackbar
        open={Boolean(updateError || createError)}
        message={errorMessage}
      />
    </div>
  );
};

export default ServiceMessageBrokerConnection;
