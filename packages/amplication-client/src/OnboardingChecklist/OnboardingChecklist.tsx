import { useEffect, useMemo } from "react";

import * as models from "../models";

import { ProductFruits, useProductFruitsApi } from "react-product-fruits";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { REACT_APP_PRODUCT_FRUITS_WORKSPACE_CODE } from "../env";
import { useOnboardingChecklistContext } from "./context/OnboardingChecklistContext";
import useProjectResources from "../Workspaces/hooks/useprojectResources";

type Props = {
  account?: models.Account;
};

function OnboardingChecklist({ account }: Props) {
  const {
    currentWorkspace,
    projectsList,
    currentProject,
    currentResource,
    resources: currentProjectResources,
  } = useAppContext();

  // useProductFruitsApi((api) => {
  //   api.checklists.listen("item-launched", (id, internalId) => {
  //     console.log("Item launched", id, internalId);

  //   });
  // }, [resourceId,]);

  const { currentOnboardingProps, setOnboardingProps } =
    useOnboardingChecklistContext();

  const { getProjectResources, projectResourcesData } = useProjectResources();

  const history = useHistory();

  useEffect(() => {
    if (
      currentProjectResources &&
      currentProjectResources.length > 0 &&
      !currentOnboardingProps.serviceCreated
    ) {
      setOnboardingProps({
        serviceCreated: true,
      });
    }
  }, [
    currentOnboardingProps?.serviceCreated,
    currentProjectResources,
    setOnboardingProps,
  ]);

  const projectId = useMemo(() => {
    if (!currentProject) {
      return projectsList?.[0]?.id;
    }
    return currentProject.id;
  }, [currentProject, projectsList]);

  useEffect(() => {
    if (projectId && !currentProject) {
      //load the project when there is no current project
      getProjectResources(projectId);
    }
    //do not add getProjectResources to the dependencies array to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, currentProject]);

  const resourceId = useMemo(() => {
    if (currentResource?.id) {
      return currentResource?.id;
    }

    if (!projectId) {
      return null;
    }

    if (currentProject && currentProjectResources.length > 0) {
      return currentProjectResources.find(
        (x) => x.resourceType === models.EnumResourceType.Service
      )?.id;
    }

    if (projectResourcesData?.resources?.length > 0) {
      return projectResourcesData.resources?.find(
        (x) =>
          x.resourceType === models.EnumResourceType.Service &&
          x.projectId === projectId
      )?.id;
    }

    return null;
  }, [
    currentResource?.id,
    projectId,
    projectResourcesData?.resources,
    currentProjectResources,
    currentProject,
  ]);

  const userInfo = useMemo(() => {
    if (!account) {
      return null;
    }

    return {
      username: account.id,
      props: {
        workspaceId: currentWorkspace?.id,
        projectId: projectId,
        resourceId: resourceId,
        showChecklist: !!resourceId,
        ...currentOnboardingProps,
      },
    };
  }, [
    account,
    currentWorkspace?.id,
    projectId,
    resourceId,
    currentOnboardingProps,
  ]);

  return userInfo ? (
    <ProductFruits
      workspaceCode={REACT_APP_PRODUCT_FRUITS_WORKSPACE_CODE}
      language="en"
      user={userInfo}
      config={{
        customNavigation: {
          use: true,
          navigate: (url) => {
            //only if all props are available, navigate to the url
            if (!url.includes("{{props.")) history.push(url);
          },
          onGet() {
            return window.location.href;
          },
        },
      }}
    />
  ) : null;
}

export default OnboardingChecklist;
