import { useState } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import { Dialog } from "@amplication/ui/design-system";
import NewServiceFromTemplate from "./NewServiceFromTemplate";
import { useAppContext } from "../context/appContext";

type Props = {
  serviceTemplateId: string;
};

function NewServiceFromTemplateButton({ serviceTemplateId }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { currentProject } = useAppContext();

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        title="Create Service"
      >
        <NewServiceFromTemplate
          projectId={currentProject?.id}
          serviceTemplateId={serviceTemplateId}
        />
      </Dialog>

      <Button
        buttonStyle={EnumButtonStyle.Text}
        icon="plus"
        onClick={() => {
          setIsOpen(true);
        }}
      />
    </>
  );
}

export default NewServiceFromTemplateButton;
