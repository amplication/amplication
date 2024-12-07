import { Dialog } from "@amplication/ui/design-system";
import * as models from "../../models";
import CreateResourceForm from "./CreateResourceForm";

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  onResourceCreated: (resource: models.Resource) => void;
};

const CreateResourceDialog = ({
  isOpen,
  onDismiss,
  onResourceCreated,
}: Props) => {
  return (
    <>
      <Dialog
        isOpen={isOpen}
        onDismiss={onDismiss}
        title="Add New Item to Catalog"
      >
        {isOpen && <CreateResourceForm />}
      </Dialog>
    </>
  );
};

export default CreateResourceDialog;
