import { useEffect, useMemo } from "react";

import * as models from "../models";

import { ProductFruits } from "react-product-fruits";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { REACT_APP_PRODUCT_FRUITS_WORKSPACE_CODE } from "../env";
import { useOnboardingChecklistContext } from "./context/OnboardingChecklistContext";

type Props = {
  account?: models.Account;
};

function OnboardingChecklist({ account }: Props) {
  const {
    currentWorkspace,
    projectsList,
    currentProject,
    currentResource,
    resources,
  } = useAppContext();

  const { currentOnboardingProps, setOnboardingProps } =
    useOnboardingChecklistContext();

  const history = useHistory();

  useEffect(() => {
    if (
      resources &&
      resources.length > 0 &&
      !currentOnboardingProps.serviceCreated
    ) {
      setOnboardingProps({
        serviceCreated: true,
      });
    }
  }, [currentOnboardingProps?.serviceCreated, resources, setOnboardingProps]);

  const userInfo = useMemo(() => {
    if (!account) {
      return null;
    }

    return {
      username: account.id,
      props: {
        workspaceId: currentWorkspace?.id,
        projectId: currentProject?.id || projectsList?.[0]?.id,
        resourceId: currentResource?.id || "clx1smm17002gq6o40kix76m2", //@todo - get the first resource of the project
        ...currentOnboardingProps,
      },
    };
  }, [
    account,
    currentWorkspace?.id,
    currentProject?.id,
    projectsList,
    currentResource?.id,
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
