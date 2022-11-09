import { Reference, useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_SERVICE_MESSAGE_BROKER_CONNECTION,
  DELETE_TOPIC_FIELD,
  GET_SERVICE_MESSAGE_BROKER_CONNECTIONS,
  UPDATE_SERVICE_MESSAGE_BROKER_CONNECTION,
} from "../queries/serviceTopicsQueries";
type TData = {
  deleteTopic: models.Topic;
};

const useServiceConnection = (resourceId: string) => {
  const { addBlock } = useContext(AppContext);

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

  const [deleteTopic] = useMutation<TData>(DELETE_TOPIC_FIELD, {
    update(cache, { data }) {
      if (!data || data === undefined) return;
      const deletedTopicId = data.deleteTopic.id;
      cache.modify({
        fields: {
          Topics(existingTopicRefs, { readField }) {
            return existingTopicRefs.filter(
              (topicRef: Reference) =>
                deletedTopicId !== readField("id", topicRef)
            );
          },
        },
      });
    },

    onCompleted: (data) => {
      addBlock(data.deleteTopic.id);
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
    deleteTopic,
  };
};

export default useServiceConnection;
