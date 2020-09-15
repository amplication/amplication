import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import "@rmwc/snackbar/styles";
import { CircularProgress } from "@rmwc/circular-progress";

import * as models from "../models";
import { Panel } from "../Components/Panel";

import { GET_LAST_BUILD } from "../VersionControl/LastBuild";
import "./CurrentBuildTile.scss";
import { Button, EnumButtonStyle } from "../Components/Button";
import publishImage from "../assets/images/publish.svg";
import UserAndTime from "../Components/UserAndTime";

type Props = {
  applicationId: string;
};

const CLASS_NAME = "current-build-tile";

function CurrentBuildTile({ applicationId }: Props) {
  const { data, loading } = useQuery<{
    builds: models.Build[];
  }>(GET_LAST_BUILD, {
    variables: {
      appId: applicationId,
    },
  });

  const lastBuild = useMemo(() => {
    if (loading) return null;
    const [last] = data?.builds;
    return last;
  }, [loading, data]);

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <Panel className={`${CLASS_NAME}`}>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className={`${CLASS_NAME}__content`}>
          <img src={publishImage} alt="publish" />
          <div className={`${CLASS_NAME}__content__details`}>
            {!lastBuild ? (
              <h2>There are no builds yet</h2>
            ) : (
              <>
                <h2>
                  Current Build
                  <span className="version-number">{lastBuild?.version}</span>
                </h2>
                <UserAndTime
                  account={lastBuild?.createdBy?.account || {}}
                  time={lastBuild?.createdAt}
                />
              </>
            )}
          </div>
          <Link to={`/${applicationId}/builds`}>
            <Button buttonStyle={EnumButtonStyle.Secondary}>Go To Page</Button>
          </Link>
        </div>
      )}
    </Panel>
  );
}

export default CurrentBuildTile;
