import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import "./PluginTree.scss";
import usePlugins from "./hooks/usePlugins";
import { Icon } from "@amplication/ui/design-system";
import { Collapse, ListItem, ListItemText } from "@mui/material";

const CLASS_NAME = "plugin-tree";

type Props = {
  resourceId: string;
  selectFirst?: boolean;
};

export const PluginTree = React.memo(
  ({ resourceId, selectFirst = false }: Props) => {
    const location = useLocation();
    const [chevronIcon, setChevronIcon] = useState("close");
    const history = useHistory();
    const { currentWorkspace, currentProject, currentResource } =
      useContext(AppContext);
    const { categories } = usePlugins(currentResource.id);

    useLayoutEffect(() => {
      const urlArr = location.pathname.split("/");
      if (urlArr[urlArr.length - 1] !== "plugins") return;

      history.push(`${location.pathname}/catalog`);
    }, [location]);

    const handleCategoriesClick = useCallback(() => {
      setChevronIcon(chevronIcon === "close" ? "open" : "close");
    }, [chevronIcon]);

    useEffect(() => {
      setChevronIcon(
        /catalog\/|!installed/.test(location.pathname) ? "open" : "close"
      );
    }, [location.pathname]);

    const setCategoriesLinks = useMemo(() => {
      return categories.map((category) => (
        <InnerTabLink
          key={category}
          icon="plugins"
          to={`/${currentWorkspace?.id}/${
            currentProject?.id
          }/${resourceId}/plugins/catalog/${encodeURIComponent(category)}`}
        >
          <span>{category}</span>
        </InnerTabLink>
      ));
    }, [categories]);

    return (
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__list`}>
          <InnerTabLink
            key={"catalog"}
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
          <ListItem
            onClick={handleCategoriesClick}
            className={`${CLASS_NAME}__categories_container`}
          >
            <ListItemText>
              <Icon icon={"filter"} />
              <div className={`${CLASS_NAME}__categories_title`}>
                Categories
              </div>
              <Icon
                className={`${CLASS_NAME}__categories_chevron`}
                icon={chevronIcon === "open" ? "chevron_down" : "chevron_up"}
                size="small"
              />
            </ListItemText>
          </ListItem>
          <Collapse in={chevronIcon === "open"} timeout="auto" unmountOnExit>
            {setCategoriesLinks}
          </Collapse>
        </div>
      </div>
    );
  }
);
