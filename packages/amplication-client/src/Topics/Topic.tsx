import { useCallback, useContext, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { AppContext } from "../context/appContext";
import { formatError } from "../util/error";
import TopicForm from "./TopicForm";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { DeleteTopic } from "./DeleteTopic";
import { Snackbar, HorizontalRule } from "@amplication/ui/design-system";
import "./Topic.scss";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type TData = {
  topic: models.Topic;
};

const CLASS_NAME = "topic";

const Topic = () => {
  const match = useRouteMatch<{
    resource: string;
    topicId: string;
  }>("/:workspace/:project/:resource/topics/:topicId");
  const [updateTopic, { error: updateError }] = useMutation(UPDATE_TOPIC);
  const { topicId, resource } = match?.params ?? {};
  const {
    addEntity,
    resetPendingChangesIndicator,
    setResetPendingChangesIndicator,
  } = useContext(AppContext);

  const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resource });
  const history = useHistory();

  const { data, error, loading, refetch } = useQuery<TData>(GET_TOPIC, {
    variables: {
      topicId,
    },
  });

  useEffect(() => {
    if (!resetPendingChangesIndicator) return;

    setResetPendingChangesIndicator(false);
    refetch();
  }, [resetPendingChangesIndicator, setResetPendingChangesIndicator, refetch]);

  const { trackEvent } = useTracking();

  const handleSubmit = useCallback(
    (data) => {
      updateTopic({
        onCompleted: () => {
          addEntity(topicId);
        },
        variables: {
          where: {
            id: topicId,
          },
          data,
        },
      }).catch(console.error);
      trackEvent({
        eventName: AnalyticsEventNames.TopicUpdate,
        ...data,
      });
    },
    [updateTopic, topicId, trackEvent, addEntity]
  );

  const hasError = Boolean(error) || Boolean(updateError);

  const errorMessage = formatError(error) || formatError(updateError);

  const handleDeleteField = useCallback(() => {
    history.push(`${baseUrl}/topics`);
  }, [history, baseUrl]);

  return (
    <>
      <div className={`${CLASS_NAME}__header`}>
        <h3>Topic Settings</h3>
        {data?.topic && (
          <DeleteTopic topic={data?.topic} onDelete={handleDeleteField} />
        )}
      </div>

      <HorizontalRule />
      {!loading && (
        <TopicForm onSubmit={handleSubmit} defaultValues={data?.topic} />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Topic;

const GET_TOPIC = gql`
  query topic($topicId: String!) {
    topic(where: { id: $topicId }) {
      id
      name
      displayName
      description
    }
  }
`;

const UPDATE_TOPIC = gql`
  mutation updateTopic($data: TopicUpdateInput!, $where: WhereUniqueInput!) {
    updateTopic(data: $data, where: $where) {
      id
      name
      displayName
      description
    }
  }
`;
