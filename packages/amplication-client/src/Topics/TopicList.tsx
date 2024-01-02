import {
  CircularProgress,
  SearchField,
  Snackbar,
} from "@amplication/ui/design-system";
import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import InnerTabLink from "../Layout/InnerTabLink";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
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
    const { currentWorkspace, currentProject } = useContext(AppContext);

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
        const fieldUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/topics/${topic.id}`;
        history.push(fieldUrl);
      },
      [history, resourceId, currentWorkspace, currentProject]
    );

    useEffect(() => {
      if (selectFirst && data && !isEmpty(data.topics)) {
        const topic = data.topics[0];
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
          {data?.topics.length}{" "}
          {pluralize(data?.topics.length, "Topic", "Topics")}
        </div>
        {loading && <CircularProgress />}
        <div className={`${CLASS_NAME}__list`}>
          {data?.topics?.map((topic) => (
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
