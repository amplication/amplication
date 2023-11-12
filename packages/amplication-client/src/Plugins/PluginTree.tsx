import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import { startCase } from "lodash";
import { AppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import "./PluginTree.scss";
import usePlugins from "./hooks/usePlugins";

const CLASS_NAME = "plugin-list";

type Props = {
  resourceId: string;
  selectFirst?: boolean;
};

export const PluginTree = React.memo(
  ({ resourceId, selectFirst = false }: Props) => {
    const location = useLocation();
    const history = useHistory();
    const { currentWorkspace, currentProject } = useContext(AppContext);
    const [isCategoryFilterOpen, setIsCategoryFilterOpen] =
      useState<boolean>(false);
    const { pluginCatalog } = usePlugins(resourceId);

    useEffect(() => {
      if (/catalog|installed/.test(location.pathname)) return;

      history.push(`${location.pathname}/catalog`);
    }, [location]);

    const pluginCategories = useMemo(() => {
      const categorySet = new Set<string>();

      Object.entries(pluginCatalog).forEach(([pluginId, plugin]) => {
        const categories = plugin.categories.split(",");
        categories.forEach((category) => categorySet.add(category));
      });

      return Array.from(categorySet).sort();
    }, [pluginCatalog]);

    const queryCategory = useMemo(
      () => new URLSearchParams(location.search).get("category"),
      [location.search]
    );

    return (
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__list`}>
          <div className="category-filter">
            <InnerTabLink
              icon="plugins"
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/plugins/catalog`}
            >
              Plugins Catalog
            </InnerTabLink>
            <Button
              buttonStyle={EnumButtonStyle.Text}
              type="button"
              onClick={() => setIsCategoryFilterOpen((isOpen) => !isOpen)}
              icon={isCategoryFilterOpen ? "chevron_up" : "chevron_down"}
              iconSize="xsmall"
              className="filter-dropdown-icon"
            />
          </div>
          {isCategoryFilterOpen && (
            <div className="category-list">
              {pluginCategories.map((category) => (
                <InnerTabLink
                  to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/plugins/catalog?category=${category}`}
                  className={category === queryCategory && "highlighted"}
                  key={category}
                >
                  {startCase(category.replace(/-/g, " "))}
                </InnerTabLink>
              ))}
            </div>
          )}
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
