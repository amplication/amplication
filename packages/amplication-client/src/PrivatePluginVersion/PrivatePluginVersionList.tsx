import { List, TabContentTitle } from "@amplication/ui/design-system";
import React, { useCallback, useMemo } from "react";
import * as models from "../models";
import PrivatePluginVersion from "./PrivatePluginVersion";
import NewPrivatePluginVersion from "./NewPrivatePluginVersion";
import { compareBuild } from "semver";

type Props = {
  privatePlugin: models.PrivatePlugin;
  onVersionAdd?: (member: models.PrivatePlugin) => void;
};
const PrivatePluginVersionList = React.memo(
  ({ privatePlugin, onVersionAdd }: Props) => {
    const onVersionChanged = useCallback(() => {
      onVersionAdd && onVersionAdd(privatePlugin);
    }, [privatePlugin, onVersionAdd]);

    const sortedVersions = useMemo(() => {
      if (!privatePlugin) return [];
      return privatePlugin.versions?.sort((a, b) =>
        compareBuild(b.version, a.version)
      );
    }, [privatePlugin]);

    return (
      <>
        <NewPrivatePluginVersion
          privatePlugin={privatePlugin}
          onVersionAdd={onVersionAdd}
        />
        <TabContentTitle title="Versions" />

        <List>
          {sortedVersions?.map((version, index) => (
            <PrivatePluginVersion
              key={index}
              privatePlugin={privatePlugin}
              privatePluginVersion={version}
              onVersionChanged={onVersionChanged}
            />
          ))}
        </List>
      </>
    );
  }
);

export default PrivatePluginVersionList;
