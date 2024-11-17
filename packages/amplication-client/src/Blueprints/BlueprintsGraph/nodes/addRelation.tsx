import React from "react";
import * as models from "../../../models";
import { formatError } from "../../../util/error";
import BlueprintRelationAddButton from "../../BlueprintRelationAddButton";
import useBlueprints from "../../hooks/useBlueprints";
import { Snackbar } from "@mui/material";
import { EnumButtonStyle, Icon } from "@amplication/ui/design-system";

type Props = {
  blueprint: models.Blueprint;
};

const AddRelation = React.memo(({ blueprint }: Props) => {
  const {
    upsertBlueprintRelation,
    upsertBlueprintRelationError,
    upsertBlueprintRelationLoading,
  } = useBlueprints(blueprint?.id);

  const errorMessage = formatError(upsertBlueprintRelationError);

  const handleSubmit = (relation: models.BlueprintRelation) => {
    const variables: models.MutationUpsertBlueprintRelationArgs = {
      data: relation,
      where: {
        blueprint: {
          id: blueprint.id,
        },
        relationKey: relation.key,
      },
    };

    upsertBlueprintRelation({
      variables,
    }).catch(console.error);
  };

  return (
    <>
      <BlueprintRelationAddButton
        blueprint={blueprint}
        onSubmit={handleSubmit}
        buttonContent={<Icon icon="plus" />}
        buttonStyle={EnumButtonStyle.Text}
      />
      <Snackbar
        open={Boolean(upsertBlueprintRelationError)}
        message={errorMessage}
      />
    </>
  );
});

export default AddRelation;
