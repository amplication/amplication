import {
  CircleBadge,
  CircularProgress,
  Dialog,
  EnumFlexItemMargin,
  EnumItemsAlign,
  FlexItem,
  Icon,
  List,
  ListItem,
  Snackbar,
  TabContentTitle,
  Tooltip,
} from "@amplication/ui/design-system";
import React from "react";
import * as models from "../models";
import { formatError } from "../util/error";
import BlueprintRelationAddButton from "./BlueprintRelationAddButton";
import useBlueprints from "./hooks/useBlueprints";
import BlueprintRelationForm from "./BlueprintRelationForm";
import useBlueprintsMap from "./hooks/useBlueprintsMap";

type Props = {
  blueprint: models.Blueprint;
  onRelationUpdated?: (blueprintRelation: models.BlueprintRelation) => void;
};

const BlueprintRelationList = React.memo(
  ({ blueprint, onRelationUpdated }: Props) => {
    const {
      upsertBlueprintRelation,
      upsertBlueprintRelationError,
      upsertBlueprintRelationLoading,
    } = useBlueprints(blueprint?.id);

    const { blueprintsMap } = useBlueprintsMap();

    const errorMessage = formatError(upsertBlueprintRelationError);

    const [selectedRelation, setSelectedRelation] =
      React.useState<models.BlueprintRelation | null>(null);

    const handleSubmit = (relation: models.BlueprintRelation) => {
      const variables: models.MutationUpsertBlueprintRelationArgs = {
        data: relation,
        where: {
          blueprint: {
            id: blueprint.id,
          },
          relationKey: selectedRelation?.key || relation.key,
        },
      };

      upsertBlueprintRelation({
        variables,
      })
        .catch(console.error)
        .then((data) => {
          setSelectedRelation(null);
          onRelationUpdated &&
            onRelationUpdated(data && data.data.upsertBlueprintRelation);
        });
    };

    const loading = upsertBlueprintRelationLoading;

    return (
      <>
        <Dialog
          isOpen={!!selectedRelation}
          onDismiss={() => setSelectedRelation(null)}
          title={selectedRelation?.name}
        >
          {!!selectedRelation && (
            <BlueprintRelationForm
              blueprintRelation={selectedRelation}
              onSubmit={handleSubmit}
            />
          )}
        </Dialog>
        <TabContentTitle
          title="Relations"
          subTitle="Define relations between blueprints "
        />
        <FlexItem
          margin={EnumFlexItemMargin.Bottom}
          itemsAlign={EnumItemsAlign.Center}
          end={
            blueprint && (
              <BlueprintRelationAddButton
                blueprint={blueprint}
                onSubmit={handleSubmit}
              />
            )
          }
        >
          {loading && <CircularProgress />}
        </FlexItem>
        <List>
          {(!blueprint?.relations || blueprint?.relations?.length === 0) && (
            <ListItem>No relations defined</ListItem>
          )}

          {blueprint?.relations?.map((relation, index) => (
            <ListItem
              // end={
              //   <Button
              //     icon="trash_2"
              //     buttonStyle={EnumButtonStyle.Text}
              //     onClick={() => {
              //       handleRemoveMembers(relation.id);
              //     }}
              //   />
              // }
              key={relation.key}
              onClick={() => setSelectedRelation(relation)}
              start={
                <Tooltip
                  title={blueprintsMap[relation.relatedTo]?.name}
                  direction="ne"
                >
                  <CircleBadge
                    color={blueprintsMap[relation.relatedTo]?.color}
                    size={"small"}
                  >
                    <Icon icon={"hexagon"} size={"small"} />
                  </CircleBadge>
                </Tooltip>
              }
            >
              {relation.name}
            </ListItem>
          ))}
        </List>
        <Snackbar
          open={Boolean(upsertBlueprintRelationError)}
          message={errorMessage}
        />
      </>
    );
  }
);

export default BlueprintRelationList;
