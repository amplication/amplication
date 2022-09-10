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
} from "@amplication/design-system";
import NewTopic from "./NewTopic";
import InnerTabLink from "../Layout/InnerTabLink";
import "./TopicList.scss";
import { AppContext } from "../context/appContext";

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
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const { currentWorkspace, currentProject } = useContext(AppContext);

    const handleSearchChange = useCallback(
      (value) => {
        setSearchPhrase(value);
      },
      [setSearchPhrase]
    );
    const history = useHistory();

    const { data, loading, error } = useQuery<TData>(GET_ROLES, {
      variables: {
        id: resourceId,
        orderBy: {
          [DATE_CREATED_FIELD]: models.SortOrder.Asc,
        },
        whereName:
          searchPhrase !== ""
            ? {
                contains: searchPhrase,
                mode: models.QueryMode.Insensitive,
              }
            : undefined,
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
          {data?.Topics.length} Topics
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

export const GET_ROLES = gql`
  query Topics(
    $id: String!
    $orderBy: TopicOrderByInput
    $whereName: StringFilter
  ) {
    Topics(
      where: { resource: { id: $id }, displayName: $whereName }
      orderBy: $orderBy
    ) {
      id
      name
      displayName
      description
    }
  }
`;
