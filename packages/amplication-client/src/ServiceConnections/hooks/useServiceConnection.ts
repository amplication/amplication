import { useMutation, useQuery } from "@apollo/client";
import * as models from "../../models";
import {
  CREATE_SERVICE_MESSAGE_BROKER_CONNECTION,
  GET_SERVICE_MESSAGE_BROKER_CONNECTIONS,
  UPDATE_SERVICE_MESSAGE_BROKER_CONNECTION,
} from "../queries/serviceTopicsQueries";

const useServiceConnection = (resourceId: string) => {
  const {
    data: serviceTopicsList,
    loading: loadingServiceTopics,
    error: errorServiceTopics,
    refetch,
  } = useQuery<{
    ServiceTopicsList: models.ServiceTopics[];
  }>(GET_SERVICE_MESSAGE_BROKER_CONNECTIONS, {
    variables: {
      resourceId: resourceId,
    },
  });

  const [updateServiceTopics, { error: updateError }] = useMutation<{
    updateServiceTopics: models.ServiceTopics;
  }>(UPDATE_SERVICE_MESSAGE_BROKER_CONNECTION, {
    onCompleted() {
      refetch();
    },
  });

  const [createServiceTopics, { error: createError }] = useMutation<{
    createServiceTopics: models.ServiceTopics;
  }>(CREATE_SERVICE_MESSAGE_BROKER_CONNECTION, {
    onCompleted() {
      refetch();
    },
  });

  return {
    serviceTopicsList,
    loadingServiceTopics,
    errorServiceTopics,
    updateServiceTopics,
    updateError,
    createServiceTopics,
    createError,
  };
};

export default useServiceConnection;
