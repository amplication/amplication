import { MultiStateToggle, Snackbar } from "@amplication/design-system";
import React, { useCallback, useContext, useState } from "react";
import { match } from "react-router-dom";
import { BackNavigation } from "../Components/BackNavigation";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import { PendingChange } from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import useCommits from "./hooks/useCommits";
import { EnumCompareType } from "./PendingChangeDiffEntity";
import "./PendingChangesPage.scss";
import PendingChangeWithCompare from "./PendingChangeWithCompare";

const CLASS_NAME = "changes-page";
const SPLIT = "Split";
const UNIFIED = "Unified";

const OPTIONS = [
  { value: UNIFIED, label: UNIFIED },
  { value: SPLIT, label: SPLIT },
];

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
  const [splitView, setSplitView] = useState<boolean>(false);
  const pageTitle = "Changes";
  const { commitChangesByResource, commitsError } = useCommits();
  const { currentProject, currentWorkspace } = useContext(AppContext);

  const commitResourceChanges = commitChangesByResource(commitId).find(
    (resource) => resource.resourceId === resourceId
  )?.changes;

  const handleChangeType = useCallback(
    (type: string) => {
      setSplitView(type === SPLIT);
    },
    [setSplitView]
  );

  const errorMessage = formatError(commitsError);

  return (
    <>
      <PageContent className={CLASS_NAME} pageTitle={pageTitle}>
        <BackNavigation
          to={`/${currentWorkspace?.id}/${currentProject?.id}/commits/${commitId}`}
          label="Back to Commits"
        />

        <div className={`${CLASS_NAME}__header`}>
          <h1>Changes Page</h1>
          <MultiStateToggle
            label=""
            name="compareMode"
            options={OPTIONS}
            onChange={handleChangeType}
            selectedValue={splitView ? SPLIT : UNIFIED}
          />
        </div>
        <div className={`${CLASS_NAME}__changes`}>
          {commitResourceChanges &&
            commitResourceChanges.map((change: PendingChange) => (
              <PendingChangeWithCompare
                key={change.originId}
                change={change}
                compareType={EnumCompareType.Previous}
                splitView={splitView}
              />
            ))}
        </div>
      </PageContent>
      <Snackbar open={Boolean(commitsError)} message={errorMessage} />
    </>
  );
};

export default ChangesPage;
