import { Button, Dialog, EnumButtonStyle } from "@amplication/ui/design-system";
import { useState } from "react";
import NewPackage from "./NewPackage";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../../context/appContext";

const NewPackageCreateButton = () => {
  const [newPackage, setNewPackage] = useState<boolean>(false);
  const { currentWorkspace, currentProject, currentResource } = useAppContext();
  const history = useHistory();

  return (
    <div>
      <Button
        buttonStyle={EnumButtonStyle.Primary}
        onClick={() => {
          setNewPackage(true);
        }}
      >
        Create new Package
      </Button>
      <Dialog
        isOpen={newPackage}
        onDismiss={() => {
          setNewPackage(false);
        }}
        title="New Package"
      >
        <NewPackage
          onSuccess={() => {
            setNewPackage(false);
            history.push(
              `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/packages`
            );
          }}
        ></NewPackage>
      </Dialog>
    </div>
  );
};

export default NewPackageCreateButton;
