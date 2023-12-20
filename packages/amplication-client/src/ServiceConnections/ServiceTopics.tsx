import { Snackbar } from "@amplication/ui/design-system";
import React, { useCallback, useContext, useMemo } from "react";
import { useRouteMatch } from "react-router-dom";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import useServiceConnection from "./hooks/useServiceConnection";
import "./ServiceTopics.scss";
import ServiceTopicsForm from "./ServiceTopicsForm";
const CLASS_NAME = "service-topics";

const ServiceTopics = () => {
  const match = useRouteMatch<{
    resource: string;
    connectedResourceId: string;
  }>("/:workspace/:project/:resource/service-connections/:connectedResourceId");

  const { resource, connectedResourceId } = match?.params ?? {
    resource: "",
    connectedResourceId: "",
  };

  const { resources } = useContext(AppContext);

  const connectedResource = useMemo(() => {
    return resources.find((resource) => resource.id === connectedResourceId);
  }, [resources, connectedResourceId]);

  const {
    serviceTopicsList: data,
    updateServiceTopics: update,
    updateError,
    createServiceTopics: create,
    createError,
  } = useServiceConnection(resource);

  const serviceTopics = useMemo(() => {
    return data?.ServiceTopicsList.find(
      (connection) => connection.messageBrokerId === connectedResourceId
    );
  }, [data, connectedResourceId]);

  const handleSubmit = useCallback(
    (data: models.ServiceTopics) => {
      if (serviceTopics?.id) {
        update({
          variables: {
            where: {
              id: serviceTopics?.id,
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
    [update, create, serviceTopics, connectedResourceId, resource]
  );

  const errorMessage = formatError(updateError || createError);

  return (
    <div className={CLASS_NAME}>
      {connectedResource && (
        <ServiceTopicsForm
          onSubmit={handleSubmit}
          defaultValues={serviceTopics}
          connectedResource={connectedResource}
        />
      )}

      <Snackbar
        open={Boolean(updateError || createError)}
        message={errorMessage}
      />
    </div>
  );
};

export default ServiceTopics;
