import React, { useCallback } from "react";
import { useRouteMatch } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Snackbar, HorizontalRule } from "@amplication/design-system";

import { formatError } from "../util/error";
import TopicForm from "./TopicForm";
import * as models from "../models";

type TData = {
  Topic: models.Topic;
};

const CLASS_NAME = "topic-page";

const Topic = () => {
  const match = useRouteMatch<{
    resource: string;
    topicId: string;
  }>("/:workspace/:project/:resource/topics/:topicId");

  const { topicId } = match?.params ?? {};

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

  return (
    <>
      <div className={`${CLASS_NAME}__header`}>
        <h3>Topic Settings</h3>
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
