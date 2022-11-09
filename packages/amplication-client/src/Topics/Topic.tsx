import React, { useCallback, useContext, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Snackbar, HorizontalRule } from "@amplication/design-system";
import "./Topic.scss";

import { formatError } from "../util/error";
import TopicForm from "./TopicForm";
import * as models from "../models";
import { DeleteTopic } from "./DeleteTopic";
import { AppContext } from "../context/appContext";

type TData = {
  Topic: models.Topic;
};

const CLASS_NAME = "topic";

const Topic = () => {
  const match = useRouteMatch<{
    resource: string;
    topicId: string;
  }>("/:workspace/:project/:resource/topics/:topicId");

  const { topicId, resource } = match?.params ?? {};
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const history = useHistory();

  const { data, error, loading } = useQuery<TData>(GET_TOPIC, {
    variables: {
      topicId,
    },
  });

  const [updateTopic, { error: updateError }] = useMutation(UPDATE_TOPIC);

  const handleSubmit = useCallback(
    (data) => {
      updateTopic({
        variables: {
          where: {
            id: topicId,
          },
          data,
        },
      }).catch(console.error);
    },
    [updateTopic, topicId]
  );

  const hasError = Boolean(error) || Boolean(updateError);
  const errorMessage = formatError(error) || formatError(updateError);
  const [error2, setError] = useState<Error>();

  if (error2) console.log({ error2 });

  const handleDeleteField = useCallback(() => {
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resource}/topics`
    );
  }, [history, currentWorkspace?.id, currentProject?.id, resource]);

  return (
    <>
      <div className={`${CLASS_NAME}__header`}>
        <h3>Topic Settings</h3>
        {data?.Topic && (
          <DeleteTopic
            topic={data?.Topic}
            onError={setError}
            onDelete={handleDeleteField}
          />
        )}
      </div>

      <HorizontalRule />
      {!loading && (
        <TopicForm onSubmit={handleSubmit} defaultValues={data?.Topic} />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Topic;

const GET_TOPIC = gql`
  query Topic($topicId: String!) {
    Topic(where: { id: $topicId }) {
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
