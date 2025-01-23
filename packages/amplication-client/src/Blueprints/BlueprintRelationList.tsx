import {
  Button,
  CircularProgress,
  Dialog,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumIconPosition,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  List,
  ListItem,
  Modal,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import React, { useState } from "react";
import { useAppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import BlueprintCircleBadge from "./BlueprintCircleBadge";
import BlueprintRelationAddButton from "./BlueprintRelationAddButton";
import { BlueprintRelationDelete } from "./BlueprintRelationDelete";
import BlueprintRelationForm from "./BlueprintRelationForm";
import "./BlueprintRelationList.scss";
import BlueprintGraph from "./BlueprintsGraph/BlueprintGraph";
import useBlueprints from "./hooks/useBlueprints";

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

    const [graphIsOpen, setGraphIsOpen] = useState(false);

    const {
      blueprintsMap: { blueprintsMap },
    } = useAppContext();

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
          subTitle="Relations define how blueprints are connected to each other"
        />
        <FlexItem
          margin={EnumFlexItemMargin.Bottom}
          itemsAlign={EnumItemsAlign.Center}
          end={
            blueprint && (
              <FlexItem
                direction={EnumFlexDirection.Row}
                itemsAlign={EnumItemsAlign.Center}
              >
                <BlueprintRelationAddButton
                  blueprint={blueprint}
                  onSubmit={handleSubmit}
                />
                <Button
                  icon="relation"
                  iconPosition={EnumIconPosition.Left}
                  buttonStyle={EnumButtonStyle.Outline}
                  onClick={() => setGraphIsOpen(true)}
                >
                  Show Graph
                </Button>
              </FlexItem>
            )
          }
        >
          {loading && <CircularProgress />}
        </FlexItem>
        <List>
          {(!blueprint?.relations || blueprint?.relations?.length === 0) && (
            <ListItem>
              <Text textStyle={EnumTextStyle.Description}>
                No relations defined
              </Text>
            </ListItem>
          )}

          {blueprint?.relations?.map((relation, index) => (
            <ListItem
              direction={EnumFlexDirection.Row}
              itemsAlign={EnumItemsAlign.Center}
              end={
                <BlueprintRelationDelete
                  blueprint={blueprint}
                  relation={relation}
                  onDelete={() => {
                    onRelationUpdated && onRelationUpdated(null);
                  }}
                />
              }
              key={relation.key}
              onClick={() => setSelectedRelation(relation)}
              start={
                <BlueprintCircleBadge
                  blueprint={blueprintsMap[relation.relatedTo]}
                />
              }
            >
              <Text textStyle={EnumTextStyle.Normal}>{relation.name}</Text>
              <Text textStyle={EnumTextStyle.Description}>{relation.key}</Text>
            </ListItem>
          ))}
        </List>
        {graphIsOpen && (
          <Modal
            css="blueprint-graph-modal"
            onCloseEvent={() => setGraphIsOpen(false)}
            open={graphIsOpen}
            fullScreen
            showCloseButton={true}
          >
            <BlueprintGraph />
          </Modal>
        )}
        <Snackbar
          open={Boolean(upsertBlueprintRelationError)}
          message={errorMessage}
        />
      </>
    );
  }
);

export default BlueprintRelationList;
