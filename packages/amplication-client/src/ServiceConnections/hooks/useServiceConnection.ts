import { useQuery } from "@apollo/client";
import { GET_SERVICE_MESSAGE_BROKER_CONNECTIONS } from "../queries/serviceMessageBrokerConnectionQueries";
import * as models from "../../models";

const useServiceConnection = (resourceId: string) => {
  const {
    data: serviceMessageBrokerConnections,
    loading: loadingServiceMessageBrokerConnections,
    error: errorServiceMessageBrokerConnections,
  } = useQuery<{
    ServiceMessageBrokerConnections: models.ServiceMessageBrokerConnection[];
  }>(GET_SERVICE_MESSAGE_BROKER_CONNECTIONS, {
    variables: {
      resourceId: resourceId,
    },
  });

  return {
    serviceMessageBrokerConnections,
    loadingServiceMessageBrokerConnections,
    errorServiceMessageBrokerConnections,
  };
};

export default useServiceConnection;
