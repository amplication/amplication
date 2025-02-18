import {
  EnumContentAlign,
  EnumItemsAlign,
  FlexItem,
  List,
  TabContentTitle,
} from "@amplication/ui/design-system";
import React, { useCallback, useMemo } from "react";
import * as models from "../models";
import PrivatePluginVersion from "./PrivatePluginVersion";
import NewPrivatePluginVersion from "./NewPrivatePluginVersion";
import { compareBuild, valid } from "semver";
import PrivatePluginDevVersion from "./PrivatePluginDevVersion";

type Props = {
  privatePlugin: models.PrivatePlugin;
  onVersionAdd?: (plugin: models.PrivatePlugin) => void;
  disabled?: boolean;
};
const PrivatePluginVersionList = React.memo(
  ({ privatePlugin, onVersionAdd, disabled }: Props) => {
    const onVersionChanged = useCallback(() => {
      onVersionAdd && onVersionAdd(privatePlugin);
    }, [privatePlugin, onVersionAdd]);

    const sortedVersions = useMemo(() => {
      if (!privatePlugin) return [];

      return privatePlugin.versions
        ?.filter((x) => !x.version.includes("dev"))
        .sort((a, b) =>
          !valid(b.version)
            ? 1
            : !valid(a.version)
            ? -1
            : compareBuild(b.version, a.version)
        );
    }, [privatePlugin]);

    return (
      <>
        <TabContentTitle title="Versions" />

        <FlexItem
          itemsAlign={EnumItemsAlign.Stretch}
          contentAlign={EnumContentAlign.Space}
        >
          <NewPrivatePluginVersion
            disabled={disabled}
            privatePlugin={privatePlugin}
            onVersionAdd={onVersionAdd}
          />
          <PrivatePluginDevVersion
            disabled={disabled}
            privatePlugin={privatePlugin}
            onChange={onVersionAdd}
          />
        </FlexItem>

        <List>
          {sortedVersions?.map((version, index) => (
            <PrivatePluginVersion
              disabled={disabled}
              key={version.version}
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
