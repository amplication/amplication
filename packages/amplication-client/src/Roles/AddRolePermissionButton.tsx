import { Button, Dialog, EnumButtonStyle } from "@amplication/ui/design-system";
import { useState } from "react";
import * as models from "../models";
import AddRolePermission from "./AddRolePermission";

type Props = {
  role: models.Role;
  onAddPermissions: (userIds: string[]) => void;
};

const AddRolePermissionButton = ({ role, onAddPermissions }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddRolePermission = (userIds: string[]) => {
    onAddPermissions(userIds);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        title="Add Permission"
      >
        {isOpen && (
          <AddRolePermission
            role={role}
            onAddPermissions={handleAddRolePermission}
          />
        )}
      </Dialog>

      <Button
        buttonStyle={EnumButtonStyle.Outline}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Add Permission
      </Button>
    </>
  );
};

export default AddRolePermissionButton;
