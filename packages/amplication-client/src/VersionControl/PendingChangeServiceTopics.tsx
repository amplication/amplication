import React, { useContext, useMemo } from "react";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import useServiceConnection from "../ServiceConnections/hooks/useServiceConnection";
import PendingChangeContent from "./PendingChangeContent";

type Props = {
  change: models.PendingChange;
  linkToOrigin: boolean;
};

const PendingChangeServiceTopics = ({ change, linkToOrigin }: Props) => {
  const { origin } = change;
  const { resources } = useContext(AppContext);

  const { serviceTopicsList } = useServiceConnection(change.resource.id);

  const connectedBroker = useMemo(() => {
    const connection = serviceTopicsList?.ServiceTopicsList.find(
      (item) => item.id === origin.id
    );

    return resources.find(
      (resource) => resource.id === connection?.messageBrokerId
    );
  }, [serviceTopicsList, resources, origin.id]);

  const url = `service-connections/${connectedBroker?.id}`;

  return (
    <PendingChangeContent
      change={change}
      relativeUrl={url}
      name={connectedBroker?.name || ""}
      linkToOrigin={linkToOrigin}
    />
  );
};

export default PendingChangeServiceTopics;
