import { Snackbar, TabContentTitle } from "@amplication/ui/design-system";
import React, { useContext } from "react";
import { match } from "react-router-dom";
import { BackNavigation } from "../Components/BackNavigation";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import { PendingChange } from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { EnumCompareType } from "./PendingChangeDiffEntity";
import "./PendingChangesPage.scss";
import PendingChangeWithCompare from "./PendingChangeWithCompare";

const CLASS_NAME = "changes-page";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
    commit: string;
  }>;
};

const ChangesPage: React.FC<Props> = ({ match }) => {
  const commitId = match.params.commit;
  const resourceId = match.params.resource;
  const pageTitle = "Changes";
  const { commitUtils } = useContext(AppContext);
  const { baseUrl } = useProjectBaseUrl();

  const commitResourceChanges = commitUtils
    .commitChangesByResource(commitId)
    .find((resource) => resource.resourceId === resourceId)?.changes;

  const errorMessage = formatError(commitUtils.commitsError);

  return (
    <>
      <PageContent className={CLASS_NAME} pageTitle={pageTitle}>
        <BackNavigation
          to={`${baseUrl}/commits/${commitId}`}
          label="Back to Commits"
        />
        <TabContentTitle title="Changes" />

        <div className={`${CLASS_NAME}__changes`}>
          {commitResourceChanges &&
            commitResourceChanges.map((change: PendingChange) => (
              <PendingChangeWithCompare
                key={change.originId}
                change={change}
                compareType={EnumCompareType.Previous}
              />
            ))}
        </div>
      </PageContent>
      <Snackbar
        open={Boolean(commitUtils.commitsError)}
        message={errorMessage}
      />
    </>
  );
};

export default ChangesPage;
