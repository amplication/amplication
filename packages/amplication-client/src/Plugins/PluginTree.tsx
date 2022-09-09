import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import "./PluginTree.scss";

const CLASS_NAME = "plugin-list";

type Props = {
  resourceId: string;
  selectFirst?: boolean;
};

export const PluginTree = React.memo(
  ({ resourceId, selectFirst = false }: Props) => {
    const { currentWorkspace, currentProject } = useContext(AppContext);

    return (
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__list`}>
          <InnerTabLink
            icon="plugins"
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/plugins/catalog`}
          >
            <span>All Plugins</span>
          </InnerTabLink>
          <InnerTabLink
            icon="plugins"
            to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/plugins/installed`}
          >
            <span>Installed Plugins</span>
          </InnerTabLink>
        </div>
      </div>
    );
  }
);
