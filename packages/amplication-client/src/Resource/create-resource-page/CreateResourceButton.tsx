import { useCallback, useState } from "react";
import * as models from "../../models";
import CreateResourceDialog from "./CreateResourceDialog";
import { Button, EnumButtonStyle } from "@amplication/ui/design-system";

const CreateResourceButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <>
      <CreateResourceDialog
        isOpen={isOpen}
        onDismiss={handleDismiss}
        onResourceCreated={(resource: models.Resource) => {}}
      />
      <Button
        buttonStyle={EnumButtonStyle.Primary}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Add New Item to Catalog
      </Button>
    </>
  );
};

export default CreateResourceButton;
