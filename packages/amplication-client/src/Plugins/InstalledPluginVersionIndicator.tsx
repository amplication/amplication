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
import { LATEST_VERSION_TAG, NEVER_VERSION_TAG } from "./constant";
import { Plugin } from "./hooks/usePluginCatalog";
import { useResourceContext } from "../context/resourceContext";
import { compareBuild, valid } from "semver";

type Props = {
  plugin: Plugin;
  pluginInstallation: models.PluginInstallation;
};

function InstalledPluginVersionIndicator({
  plugin,
  pluginInstallation,
}: Props) {
  const { lastSuccessfulGitBuildPluginVersions } = useResourceContext();

  const pluginIdKey = plugin?.isPrivate ? plugin?.pluginId : plugin?.npm;

  const lastBuildVersion =
    lastSuccessfulGitBuildPluginVersions[pluginIdKey] || NEVER_VERSION_TAG;

  const viewData = useMemo(() => {
    const { version: currentVersion } = pluginInstallation;
    const useLatestTag = currentVersion === LATEST_VERSION_TAG;

    const latestVersion = plugin?.versions?.reduce(
      (acc, version) =>
        !version.deprecated &&
        valid(version.version) &&
        compareBuild(version.version, acc) > 0
          ? version.version
          : acc,
      "0.0.1"
    );

    const updateAvailable =
      (latestVersion !== currentVersion && !useLatestTag) ||
      latestVersion !== lastBuildVersion;

    const currentVersionState: EnumVersionTagState = updateAvailable
      ? EnumVersionTagState.UpdateAvailable
      : EnumVersionTagState.Current;

    return {
      useLatestTag,
      latestVersion,
      updateAvailable,
      currentVersionState,
    };
  }, [lastBuildVersion, plugin?.versions, pluginInstallation]);

  return (
    <FlexItem itemsAlign={EnumItemsAlign.Center}>
      <Text textStyle={EnumTextStyle.Label}>Selected version:</Text>
      <VersionTag
        version={pluginInstallation.version}
        state={viewData.currentVersionState}
      />

      <Text textStyle={EnumTextStyle.Label}>Last build version:</Text>
      <VersionTag
        version={lastBuildVersion}
        state={viewData.currentVersionState}
      />

      {viewData.updateAvailable && (
        <>
          <Text textStyle={EnumTextStyle.Label}>Available version:</Text>

          <VersionTag
            version={viewData.latestVersion}
            state={viewData.currentVersionState}
          />
        </>
      )}
    </FlexItem>
  );
}

export default InstalledPluginVersionIndicator;
