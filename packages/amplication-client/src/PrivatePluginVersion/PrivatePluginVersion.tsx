import { ListItem, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useContext } from "react";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import PrivatePluginVersionForm from "./PrivatePluginVersionForm";
import usePrivatePluginVersion from "./hooks/usePrivatePluginVersion";

type Props = {
  privatePlugin: models.PrivatePlugin;
  privatePluginVersion: models.PrivatePluginVersion;
  onVersionChanged?: (enumMember: models.PrivatePluginVersion) => void;
};

const PrivatePluginVersion = ({
  privatePlugin,
  privatePluginVersion,
  onVersionChanged,
}: Props) => {
  const { addEntity } = useContext(AppContext);

  const { updatePrivatePluginVersion, updatePrivatePluginVersionError } =
    usePrivatePluginVersion();

  const handleSubmit = useCallback(
    (data) => {
      const { version, ...rest } = data;

      updatePrivatePluginVersion({
        variables: {
          where: {
            version: version,
            privatePlugin: {
              id: privatePlugin.id,
            },
          },
          data: {
            ...rest,
          },
        },
        onCompleted: () => {
          addEntity(privatePluginVersion.version);
          onVersionChanged && onVersionChanged(privatePluginVersion);
        },
      }).catch(console.error);
    },
    [
      updatePrivatePluginVersion,
      addEntity,
      privatePlugin,
      onVersionChanged,
      privatePluginVersion,
    ]
  );

  const hasError = Boolean(updatePrivatePluginVersionError);

  const errorMessage = formatError(updatePrivatePluginVersionError);

  return (
    <>
      <>
        <ListItem>
          <PrivatePluginVersionForm
            privatePlugin={privatePlugin}
            onSubmit={handleSubmit}
            defaultValues={privatePluginVersion}
          />
        </ListItem>
      </>
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default PrivatePluginVersion;
