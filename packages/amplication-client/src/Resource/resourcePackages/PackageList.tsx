import React, { useLayoutEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import InnerTabLink from "../../Layout/InnerTabLink";
import { useAppContext } from "../../context/appContext";

const CLASS_NAME = "plugin-tree";

type Props = {
  resourceId: string;
};

export const PackageList = React.memo(({ resourceId }: Props) => {
  const location = useLocation();
  const history = useHistory();

  const { currentWorkspace, currentProject } = useAppContext();

  useLayoutEffect(() => {
    const urlArr = location.pathname.split("/");
    if (urlArr[urlArr.length - 1] !== "packages") return;

    history.push(`${location.pathname}/installed`);
  }, [history, location.pathname]);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__list`}>
        <InnerTabLink
          key={"catalog"}
          icon="ai"
          to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/packages/installed`}
        >
          <span>All Packages</span>
        </InnerTabLink>
      </div>
    </div>
  );
});
