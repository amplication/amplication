import { useMemo } from "react";
import * as models from "../models";

import {
  EnumItemsAlign,
  EnumTextStyle,
  EnumVersionTagState,
  FlexItem,
  Text,
  VersionTag,
} from "@amplication/ui/design-system";
import { LATEST_VERSION_TAG } from "./constant";
import { Plugin } from "./hooks/usePluginCatalog";

type Props = {
  plugin: Plugin;
  pluginInstallation: models.PluginInstallation;
};

function InstalledPluginVersionIndicator({
  plugin,
  pluginInstallation,
}: Props) {
  const viewData = useMemo(() => {
    const { version: currentVersion } = pluginInstallation;
    const useLatestTag = currentVersion === LATEST_VERSION_TAG;
    const latestVersion = plugin?.versions.find(
      (version) => version.isLatest && version.version !== LATEST_VERSION_TAG
    )?.version;

    const updateAvailable =
      latestVersion && latestVersion !== currentVersion && !useLatestTag;

    const currentVersionState: EnumVersionTagState = updateAvailable
      ? EnumVersionTagState.UpdateAvailable
      : EnumVersionTagState.Current;

    return {
      useLatestTag,
      latestVersion,
      updateAvailable,
      currentVersionState,
    };
  }, [plugin?.versions, pluginInstallation]);

  return (
    <FlexItem itemsAlign={EnumItemsAlign.Center}>
      <Text textStyle={EnumTextStyle.Label}>Installed version:</Text>
      <VersionTag
        version={pluginInstallation.version}
        state={viewData.currentVersionState}
      />
      {viewData.updateAvailable && (
        <>
          <Text textStyle={EnumTextStyle.Label}>Available version:</Text>

          <VersionTag
            version={viewData.latestVersion}
            state={EnumVersionTagState.Current}
          />
        </>
      )}
    </FlexItem>
  );
}

export default InstalledPluginVersionIndicator;
