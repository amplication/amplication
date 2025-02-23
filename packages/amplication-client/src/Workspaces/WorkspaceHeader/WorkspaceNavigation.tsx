import {
  Breadcrumbs,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  OptionItem,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import ConsoleNavigationButton from "../../Assistant/ConsoleNavigationButton";
import ProjectSelector from "../../Components/ProjectSelector";
import ResourceSelector from "../../Components/ResourceSelector2";
import BreadcrumbsContext from "../../Layout/BreadcrumbsContext";
import { AppContext } from "../../context/appContext";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";
import "./WorkspaceHeader.scss";

const ALL_VALUE = "-1";

const ALL_PROJECTS_ITEM: OptionItem = {
  label: "All Projects",
  value: ALL_VALUE,
};
const ALL_RESOURCES_ITEM: OptionItem = {
  label: "All Resources",
  value: ALL_VALUE,
};

const CLASS_NAME = "workspace-navigation";

const WorkspaceNavigation: React.FC = () => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);
  const { isPlatformConsole } = useProjectBaseUrl();

  const history = useHistory();

  const breadcrumbsContext = useContext(BreadcrumbsContext);

  const handleProjectSelected = useCallback(
    (value: string) => {
      const platformPath = isPlatformConsole ? "/platform" : "";

      const url =
        value === ALL_VALUE
          ? `/${currentWorkspace?.id}`
          : `/${currentWorkspace?.id}${platformPath}/${value}`;

      history.push(url);
    },
    [currentWorkspace?.id, history, isPlatformConsole]
  );

  const handleResourceSelected = useCallback(
    (value: string) => {
      const platformPath = isPlatformConsole ? "/platform" : "";

      const url =
        value === ALL_VALUE
          ? `/${currentWorkspace?.id}${platformPath}/${currentProject?.id}`
          : `/${currentWorkspace?.id}${platformPath}/${currentProject?.id}/${value}`;

      history.push(url);
    },
    [currentProject?.id, currentWorkspace?.id, history, isPlatformConsole]
  );

  return (
    <FlexItem
      direction={EnumFlexDirection.Row}
      gap={EnumGapSize.Default}
      itemsAlign={EnumItemsAlign.Center}
    >
      <span />

      <Link to={`/${currentWorkspace?.id}`}>
        <Text textColor={EnumTextColor.White} textStyle={EnumTextStyle.Tag}>
          {currentWorkspace?.name}
        </Text>
      </Link>

      <span className={`${CLASS_NAME}__separator`}>/</span>
      <ProjectSelector
        onChange={handleProjectSelected}
        selectedValue={currentProject?.id || ALL_VALUE}
        allProjectsItem={ALL_PROJECTS_ITEM}
      />
      {currentProject && (
        <>
          <span className={`${CLASS_NAME}__separator`}>/</span>
          <ConsoleNavigationButton />

          {!isPlatformConsole && (
            <>
              <span className={`${CLASS_NAME}__separator`}>/</span>
              <>
                <ResourceSelector
                  onChange={handleResourceSelected}
                  selectedValue={currentResource?.id || ALL_VALUE}
                  allResourcesItem={ALL_RESOURCES_ITEM}
                  isPlatformConsole={isPlatformConsole}
                />
              </>
              {breadcrumbsContext.breadcrumbsItems.length > 0 && (
                <>
                  <span className={`${CLASS_NAME}__separator`}>/</span>
                  <Breadcrumbs>
                    {breadcrumbsContext.breadcrumbsItems.map((item, index) => (
                      <Breadcrumbs.Item key={item.url} to={item.url}>
                        {item.name}
                      </Breadcrumbs.Item>
                    ))}
                  </Breadcrumbs>
                </>
              )}
            </>
          )}
        </>
      )}
    </FlexItem>
  );
};

export default WorkspaceNavigation;
