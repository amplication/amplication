import React, { useState, useCallback, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { isEmpty } from "lodash";
import { gql, useQuery } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import {
  SearchField,
  Snackbar,
  CircularProgress,
} from "@amplication/ui/design-system";
import NewTopic from "./NewTopic";
import InnerTabLink from "../Layout/InnerTabLink";
import "./TopicList.scss";
import { AppContext } from "../context/appContext";
import { pluralize } from "../util/pluralize";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";

type TData = {
  Topics: models.Topic[];
};

const DATE_CREATED_FIELD = "createdAt";
const CLASS_NAME = "topic-list";

type Props = {
  resourceId: string;
  selectFirst?: boolean;
};

export const TopicList = React.memo(
  ({ resourceId, selectFirst = false }: Props) => {
    const { trackEvent } = useTracking();
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const { currentWorkspace, currentProject } = useContext(AppContext);

    const handleSearchChange = useCallback(
      (value) => {
        trackEvent({ eventName: AnalyticsEventNames.TopicsSearch });
        setSearchPhrase(value);
      },
      [setSearchPhrase, trackEvent]
    );
    const history = useHistory();

    const { data, loading, error } = useQuery<TData>(GET_TOPICS, {
      variables: {
        where: {
          resource: { id: resourceId },
          displayName:
            searchPhrase !== ""
              ? {
                  contains: searchPhrase,
                  mode: models.QueryMode.Insensitive,
                }
              : undefined,
        },
        orderBy: {
          [DATE_CREATED_FIELD]: models.SortOrder.Asc,
        },
      },
    });

    const errorMessage = formatError(error);

    const handleTopicChange = useCallback(
      (topic: models.Topic) => {
        const fieldUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/topics/${topic.id}`;
        history.push(fieldUrl);
      },
      [history, resourceId, currentWorkspace, currentProject]
    );

    useEffect(() => {
      if (selectFirst && data && !isEmpty(data.Topics)) {
        const topic = data.Topics[0];
        const fieldUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/topics/${topic.id}`;
        history.push(fieldUrl);
      }
    }, [
      data,
      selectFirst,
      resourceId,
      history,
      currentWorkspace,
      currentProject,
    ]);

    return (
      <div className={CLASS_NAME}>
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />
        <div className={`${CLASS_NAME}__header`}>
          {data?.Topics.length}{" "}
          {pluralize(data?.Topics.length, "Topic", "Topics")}
        </div>
        {loading && <CircularProgress />}
        <div className={`${CLASS_NAME}__list`}>
          {data?.Topics?.map((topic) => (
            <div key={topic.id} className={`${CLASS_NAME}__list__item`}>
              <InnerTabLink
                icon="topics"
                to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/topics/${topic.id}`}
              >
                <span>{topic.displayName}</span>
              </InnerTabLink>
            </div>
          ))}
        </div>
        {data?.Topics && (
          <NewTopic onTopicAdd={handleTopicChange} resourceId={resourceId} />
        )}
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    );
  }
);

export const GET_TOPICS = gql`
  query Topics($where: TopicWhereInput, $orderBy: TopicOrderByInput) {
    Topics(where: $where, orderBy: $orderBy) {
      id
      name
      displayName
      description
    }
  }
`;
