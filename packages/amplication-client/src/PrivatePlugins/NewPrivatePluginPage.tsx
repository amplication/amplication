import { EnumTextColor, Panel, Text } from "@amplication/ui/design-system";
import React, { useCallback, useContext } from "react";
import { Link, match, useHistory } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { AvailableRemotePrivatePluginList } from "./AvailableRemotePrivatePluginList";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const NewPrivatePluginPage = React.memo(({ match, innerRoutes }: Props) => {
  const { pluginRepositoryResource } = useContext(AppContext);

  const { baseUrl } = useProjectBaseUrl();

  const history = useHistory();

  const handlePrivatePluginCreated = useCallback(
    (privatePlugin: models.PrivatePlugin) => {
      const fieldUrl = `${baseUrl}/private-plugins/list/${privatePlugin.id}`;
      history.push(fieldUrl);
    },
    [history, baseUrl]
  );

  return (
    <>
      <PageContent>
        {!pluginRepositoryResource.gitRepository ? (
          <Panel>
            To add plugins you first need to{" "}
            <Link to={`${baseUrl}/private-plugins/git-settings`}>
              <Text textColor={EnumTextColor.ThemeTurquoise} underline>
                connect to a git repository.
              </Text>
            </Link>
          </Panel>
        ) : (
          <>
            <AvailableRemotePrivatePluginList
              pluginRepositoryResource={pluginRepositoryResource}
              onPrivatePluginAdd={handlePrivatePluginCreated}
              onDismiss={() => {}}
            />
          </>
        )}
      </PageContent>
    </>
  );
});

export default NewPrivatePluginPage;
