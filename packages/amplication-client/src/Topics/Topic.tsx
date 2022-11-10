import React, { useCallback } from "react";
import { useRouteMatch } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Snackbar, HorizontalRule } from "@amplication/design-system";

import { formatError } from "../util/error";
import TopicForm from "./TopicForm";
import * as models from "../models";
import { useTracking, Event as TrackEvent } from "../util/analytics";

type TData = {
  Topic: models.Topic;
};

const TOPIC_NAME_EVENT_DATA: TrackEvent = {
  eventName: "topicNameClick",
};
const TOPIC_DISPLAY_NAME_EVENT_DATA: TrackEvent = {
  eventName: "topicDisplayNameClick",
};
const TOPIC_DESCRIPTION_EVENT_DATA: TrackEvent = {
  eventName: "topicDescriptionClick",
};

const CLASS_NAME = "topic-page";

const Topic = () => {
  const { trackEvent } = useTracking();
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
      handleTrackEventForUpdateTopic(data.updateTopic);
      trackEvent(TOPIC_NAME_EVENT_DATA);
    },
    [updateTopic, topicId]
  );

  const handleTrackEventForUpdateTopic = (updateProperty: string) => {
    switch (updateProperty) {
      case "name":
        trackEvent(TOPIC_NAME_EVENT_DATA);
        break;
      case "displayName":
        trackEvent(TOPIC_DISPLAY_NAME_EVENT_DATA);
        break;
      case "description":
        trackEvent(TOPIC_DESCRIPTION_EVENT_DATA);
        break;
    }
  };

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
