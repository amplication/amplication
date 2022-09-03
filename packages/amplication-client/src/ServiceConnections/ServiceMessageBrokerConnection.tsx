import { HorizontalRule } from "@amplication/design-system";
import React from "react";
import { useRouteMatch } from "react-router-dom";

const CLASS_NAME = "service-message-broker-connection";

const ServiceMessageBrokerConnection = () => {
  const match = useRouteMatch<{
    resource: string;
    connectedResourceId: string;
  }>("/:workspace/:project/:resource/service-connections/:connectedResourceId");

  const { connectedResourceId } = match?.params ?? {};

  return (
    <div className={CLASS_NAME}>
      <HorizontalRule />
      {connectedResourceId}
    </div>
  );
};

export default ServiceMessageBrokerConnection;
