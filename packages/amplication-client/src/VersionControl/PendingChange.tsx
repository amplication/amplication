/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tooltip } from '@amplication/design-system';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import * as models from '../models';
import './PendingChange.scss';
import PendingChangeContent from './PendingChangeContent';
import PendingChangeServiceTopics from './PendingChangeServiceTopics';
import { gql, useQuery } from '@apollo/client';

const CLASS_NAME = 'pending-change';
const TOOLTIP_DIRECTION = 'ne';

type entityLinkAndDisplayName = {
  relativeUrl: string;
  icon: string;
  displayName: string;
};

type TData = {
  Topics: models.Topic[];
};

type Props = {
  resourceId: string;
  topicIndex: number;
  change: models.PendingChange;
  linkToOrigin?: boolean;
};

const DATE_CREATED_FIELD = 'createdAt';

const ACTION_TO_LABEL: {
  [key in models.EnumPendingChangeAction]: string;
} = {
  [models.EnumPendingChangeAction.Create]: 'C',
  [models.EnumPendingChangeAction.Delete]: 'D',
  [models.EnumPendingChangeAction.Update]: 'U',
};

const PendingChange = ({ resourceId, topicIndex, change, linkToOrigin = false }: Props) => {
  const { data: topicsData } = useQuery<TData>(GET_TOPICS, {
    variables: {
      where: {
        resource: { id: resourceId },
        displayName: undefined,
      },
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
    },
  });

  const content = useMemo((): React.ReactElement | null => {
    if (
      change.originType === models.EnumPendingChangeOriginType.Block &&
      (change.origin as models.Block).blockType ===
        models.EnumBlockType.ServiceTopics
    )
      return (
        <PendingChangeServiceTopics
          change={change}
          linkToOrigin={linkToOrigin}
        />
      );

    const data = changeOriginMap[change.originType](
      change.origin,
      topicIndex,
      topicsData
    );

    return (
      <PendingChangeContent
        change={change}
        name={data?.displayName || ''}
        linkToOrigin={linkToOrigin}
        relativeUrl={data?.relativeUrl || ''}
      />
    );
  }, [change, linkToOrigin, topicIndex, topicsData]);

  const isDeleted = change.action === models.EnumPendingChangeAction.Delete;

  return (
    <div className={CLASS_NAME}>
      <div
        className={classNames(
          `${CLASS_NAME}__action`,
          change.action.toLowerCase()
        )}
      >
        {ACTION_TO_LABEL[change.action]}
      </div>
      {isDeleted ? (
        <Tooltip
          wrap
          direction={TOOLTIP_DIRECTION}
          aria-label="The entity has been deleted"
          className={`${CLASS_NAME}__tooltip_deleted`}
        >
          <div className={classNames(`${CLASS_NAME}__deleted`)}>{content}</div>
        </Tooltip>
      ) : (
        content
      )}
      <div className={`${CLASS_NAME}__spacer`} />
    </div>
  );
};

export default PendingChange;

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
const changeOriginMap = {
  [models.EnumPendingChangeOriginType.Entity]: (
    change: models.PendingChangeOrigin
  ): entityLinkAndDisplayName => ({
    relativeUrl: `entities/${change.id}`,
    icon: '',
    displayName: change.displayName,
  }),
  [models.EnumPendingChangeOriginType.Block]: (
    change: models.PendingChangeOrigin,
    topicIndex: number,
    topicsData: any
  ) => {
    console.log(topicsData);
    const blockTypeMap: {
      [key in models.EnumBlockType]?: entityLinkAndDisplayName;
    } = {
      [models.EnumBlockType.ServiceSettings]: {
        relativeUrl: `settings/update`,
        icon: '',
        displayName: 'Service Settings',
      },
      [models.EnumBlockType.ProjectConfigurationSettings]: {
        relativeUrl: `settings/update`,
        icon: '',
        displayName: 'Project Settings',
      },
      [models.EnumBlockType.Topic]: {
        relativeUrl: `topics/${change.id}`,
        icon: '',
        displayName: `${topicsData?.Topics[topicIndex]?.displayName}`,
      },
      [models.EnumBlockType.PluginInstallation]: {
        relativeUrl: 'plugins/installed',
        icon: '',
        displayName: change.displayName,
      },
      [models.EnumBlockType.PluginOrder]: {
        relativeUrl: 'plugins/installed',
        icon: '',
        displayName: change.displayName,
      },
    };
    return blockTypeMap[(change as models.Block).blockType];
  },
};
