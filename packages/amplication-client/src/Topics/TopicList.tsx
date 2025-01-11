import {
  CircularProgress,
  SearchField,
  Snackbar,
} from "@amplication/ui/design-system";
import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import InnerTabLink from "../Layout/InnerTabLink";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import NewTopic from "./NewTopic";
import "./TopicList.scss";

type TData = {
  topics: models.Topic[];
};

const DATE_CREATED_FIELD = "createdAt";
const CLASS_NAME = "topic-list";

type Props = {
  resourceId: string;
  selectFirst?: boolean;
};

export const TopicList = React.memo(
  ({ resourceId, selectFirst = false }: Props) => {
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resourceId });

    const handleSearchChange = useCallback(
      (value) => {
        setSearchPhrase(value);
      },
      [setSearchPhrase]
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
        const fieldUrl = `${baseUrl}/topics/${topic.id}`;
        history.push(fieldUrl);
      },
      [history, baseUrl]
    );

    useEffect(() => {
      if (selectFirst && data && !isEmpty(data.topics)) {
        const topic = data.topics[0];
        const fieldUrl = `${baseUrl}/topics/${topic.id}`;
        history.push(fieldUrl);
      }
    }, [data, selectFirst, baseUrl, history]);

    return (
      <div className={CLASS_NAME}>
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />
        <div className={`${CLASS_NAME}__header`}>
          {data?.topics.length}{" "}
          {pluralize(data?.topics.length, "Topic", "Topics")}
        </div>
        {loading && <CircularProgress />}
        <div className={`${CLASS_NAME}__list`}>
          {data?.topics?.map((topic) => (
            <div key={topic.id} className={`${CLASS_NAME}__list__item`}>
              <InnerTabLink icon="topics" to={`${baseUrl}/topics/${topic.id}`}>
                <span>{topic.displayName}</span>
              </InnerTabLink>
            </div>
          ))}
        </div>
        {data?.topics && (
          <NewTopic onTopicAdd={handleTopicChange} resourceId={resourceId} />
        )}
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    );
  }
);

export const GET_TOPICS = gql`
  query topics($where: TopicWhereInput, $orderBy: TopicOrderByInput) {
    topics(where: $where, orderBy: $orderBy) {
      id
      name
      displayName
      description
    }
  }
`;
