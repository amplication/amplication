import {
  Button,
  Dialog,
  EnumButtonStyle,
  EnumIconPosition,
} from "@amplication/ui/design-system";
import React, { useState } from "react";
import * as models from "../models";
import { AvailableRemotePrivatePluginList } from "./AvailableRemotePrivatePluginList";

type Props = {
  pluginRepositoryResource: models.Resource;
  onPrivatePluginAdd?: (privatePlugin: models.PrivatePlugin) => void;
};

export const NewPrivatePlugin = React.memo(
  ({ pluginRepositoryResource, onPrivatePluginAdd }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!pluginRepositoryResource) {
      return null;
    }

    return (
      <>
        <Dialog
          isOpen={isOpen}
          onDismiss={() => {
            setIsOpen(false);
          }}
          title="Add Plugin"
        >
          <AvailableRemotePrivatePluginList
            pluginRepositoryResource={pluginRepositoryResource}
            onPrivatePluginAdd={onPrivatePluginAdd}
            onDismiss={() => {
              setIsOpen(false);
            }}
          />
        </Dialog>

        <Button
          buttonStyle={EnumButtonStyle.Text}
          icon="plus"
          iconPosition={EnumIconPosition.Left}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Add Plugin
        </Button>
      </>
    );
  }
);
