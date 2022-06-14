import {
  CircularProgress,
  EnumPanelStyle,
  Icon,
  Panel,
} from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { Event as TrackEvent, useTracking } from "../util/analytics";
import "./SyncWithGithubTile.scss";

type Props = {
  resourceId: string;
};

const CLASS_NAME = "sync-with-github-tile";

const EVENT_DATA: TrackEvent = {
  eventName: "syncWithGitHubTileClick",
};

type TData = {
  resource: {
    id: string;
    gitRepository: {
      id: string;
      name: string;
      gitOrganization: {
        id: string;
        name: string;
      };
    };
  };
};

function SyncWithGithubTile({ resourceId }: Props) {
  const history = useHistory();
  const { data, loading } = useQuery<TData>(
    GET_GIT_REPOSITORY_FROM_RESOURCE_ID,
    {
      variables: {
        id: resourceId,
      },
    }
  );

  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(`/${resourceId}/github`);
    },
    [history, trackEvent, resourceId]
  );

  return (
    <Panel
      className={`${CLASS_NAME}`}
      clickable
      onClick={handleClick}
      panelStyle={EnumPanelStyle.Bordered}
    >
      <div className={`${CLASS_NAME}__content`}>
        <div className={`${CLASS_NAME}__content__details`}>
          <h2>Sync with GitHub</h2>
          Enable sync with GitHub to automatically push the generated code of
          your application and create a Pull Request in your GitHub repository
          every time you commit your changes.
          {loading ? (
            <CircularProgress />
          ) : (
            <span className={`${CLASS_NAME}__content__details__summary`}>
              <Icon icon="github" size="medium" />

              {!data?.resource.gitRepository ? (
                <>You are not connected to a GitHub repository</>
              ) : (
                <>
                  You are connected to
                  <div className={`${CLASS_NAME}__repo-name`}>
                    {data?.resource.gitRepository.gitOrganization.name}/
                    {data.resource.gitRepository.name}
                  </div>
                </>
              )}
            </span>
          )}
        </div>
        <SvgThemeImage image={EnumImages.SyncWithGitHub} />
      </div>
    </Panel>
  );
}

export default SyncWithGithubTile;

const GET_GIT_REPOSITORY_FROM_RESOURCE_ID = gql`
  query getResource($id: String!) {
    resource(where: { id: $id }) {
      id
      gitRepository {
        id
        name
        gitOrganization {
          id
          name
        }
      }
    }
  }
`;
