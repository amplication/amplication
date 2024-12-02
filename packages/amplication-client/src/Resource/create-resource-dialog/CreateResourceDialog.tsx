import { Dialog } from "@amplication/ui/design-system";
import * as models from "../../models";
import CreateResourceForm, { CreateResourceType } from "./CreateResourceForm";

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  onResourceCreated: (resource: models.Resource) => void;
};

const DEFAULT_VALUES: CreateResourceType = {
  name: "",
  description: "",
};

const CreateResourceDialog = ({
  isOpen,
  onDismiss,
  onResourceCreated,
}: Props) => {
  const handleSubmit = (data: CreateResourceType) => {
    const resource: models.Resource = null;
    onResourceCreated(resource);
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onDismiss={onDismiss}
        title="Add New Item to Catalog"
      >
        {isOpen && (
          <CreateResourceForm
            initialValue={DEFAULT_VALUES}
            onSubmit={handleSubmit}
          />
        )}
      </Dialog>
    </>
  );
};

export default CreateResourceDialog;
