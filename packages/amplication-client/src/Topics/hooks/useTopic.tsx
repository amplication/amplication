import { Reference, useMutation } from "@apollo/client";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { DELETE_TOPIC } from "../../ServiceConnections/topics/queries/topicsQueries";
type TData = {
  deleteTopic: models.Topic;
};

const useTopic = (topicId: string) => {
  const { addBlock } = useContext(AppContext);

  const [deleteTopic, { error: deleteTopicError }] = useMutation<TData>(
    DELETE_TOPIC,
    {
      update(cache, { data }) {
        if (!data) {
          return;
        }
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
    }
  );

  return {
    deleteTopic,
    deleteTopicError,
  };
};

export default useTopic;
