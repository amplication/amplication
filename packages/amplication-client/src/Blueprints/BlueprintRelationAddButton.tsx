import { Button, Dialog, EnumButtonStyle } from "@amplication/ui/design-system";
import { useState } from "react";
import * as models from "../models";
import BlueprintRelationForm from "./BlueprintRelationForm";

type Props = {
  blueprint: models.Blueprint;
  onSubmit: (relation: models.BlueprintRelation) => void;
};

const DEFAULT_RELATION_VALUES: models.BlueprintRelation = {
  name: "",
  description: "",
  allowMultiple: false,
  key: "",
  relatedTo: "",
  required: false,
};

const BlueprintRelationAddButton = ({ blueprint, onSubmit }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (relation: models.BlueprintRelation) => {
    setIsOpen(false);
    onSubmit(relation);
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        title="Add Relation"
      >
        {isOpen && (
          <BlueprintRelationForm
            blueprintRelation={DEFAULT_RELATION_VALUES}
            onSubmit={handleSubmit}
          />
        )}
      </Dialog>

      <Button
        buttonStyle={EnumButtonStyle.Outline}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Add Relation
      </Button>
    </>
  );
};

export default BlueprintRelationAddButton;
