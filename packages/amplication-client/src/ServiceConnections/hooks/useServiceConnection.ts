import { useMutation, useQuery } from "@apollo/client";
import * as models from "../../models";
import {
  CREATE_SERVICE_MESSAGE_BROKER_CONNECTION,
  GET_SERVICE_MESSAGE_BROKER_CONNECTIONS,
  UPDATE_SERVICE_MESSAGE_BROKER_CONNECTION,
} from "../queries/serviceMessageBrokerConnectionQueries";

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

  const [
    updateServiceMessageBrokerConnection,
    { error: updateError },
  ] = useMutation<{
    updateServiceMessageBrokerConnection: models.ServiceMessageBrokerConnection;
  }>(UPDATE_SERVICE_MESSAGE_BROKER_CONNECTION, {
    refetchQueries: [
      {
        query: GET_SERVICE_MESSAGE_BROKER_CONNECTIONS,
        variables: {
          resourceId: resourceId,
        },
      },
    ],
  });

  const [
    createServiceMessageBrokerConnection,
    { error: createError },
  ] = useMutation<{
    createServiceMessageBrokerConnection: models.ServiceMessageBrokerConnection;
  }>(CREATE_SERVICE_MESSAGE_BROKER_CONNECTION, {
    refetchQueries: [
      {
        query: GET_SERVICE_MESSAGE_BROKER_CONNECTIONS,
        variables: {
          resourceId: resourceId,
        },
      },
    ],
  });

  return {
    serviceMessageBrokerConnections,
    loadingServiceMessageBrokerConnections,
    errorServiceMessageBrokerConnections,
    updateServiceMessageBrokerConnection,
    updateError,
    createServiceMessageBrokerConnection,
    createError,
  };
};

export default useServiceConnection;
