import React from "react";
import { match } from "react-router-dom";
import PageContent from "../../Layout/PageContent";
import { AppRouteProps } from "../../routes/routesUtil";
import CreateResourceForm from "./CreateResourceForm";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const CreateResourcePage: React.FC<Props> = ({ match }: Props) => {
  const pageTitle = "Create Resource";

  const { project } = match.params;

  return (
    <PageContent pageTitle={pageTitle} className="teams">
      <CreateResourceForm projectId={project} />
    </PageContent>
  );
};

export default CreateResourcePage;
