import React from "react";
import { match, useRouteMatch } from "react-router-dom";
import { isEmpty } from "lodash";
import PageContent from "../Layout/PageContent";
import Topic from "./Topic";
import { TopicList } from "./TopicList";
import { AppRouteProps } from "../routes/routesUtil";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const TopicsPage: React.FC<Props> = ({ match, innerRoutes }: Props) => {
  const { resource } = match.params;
  const pageTitle = "Topics";

  const topicMatch = useRouteMatch<{ topicId: string }>(
    "/:workspace/:project/:resource/topics/:topicId"
  );

  let topicId = null;
  if (topicMatch) {
    topicId = topicMatch.params.topicId;
  }

  return (
    <PageContent
      pageTitle={pageTitle}
      className="topics"
      sideContent={
        <TopicList resourceId={resource} selectFirst={null === topicId} />
      }
    >
      {match.isExact ? !isEmpty(topicId) && <Topic /> : innerRoutes}
    </PageContent>
  );
};

export default TopicsPage;
