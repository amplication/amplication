import { useFormikContext } from "formik";
import { cloneDeep, isEmpty } from "lodash";
import React, { useCallback, useReducer, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { DraggableData } from "react-draggable";
import * as models from "../models";
import "./EntitiesDiagram.scss";
import { EntitiesDiagramRelations } from "./EntitiesDiagramRelations";
import { EntitiesDiagramEntity } from "./EntitiesDiagramEntity";

import { Button, EnumButtonStyle } from "../Components/Button";
import { Snackbar } from "@amplication/design-system";

export type EntitiesDiagramFormData = models.ResourceCreateWithEntitiesInput;

export type EntityPositionData = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type EntitiesPositionData = {
  [index: number]: EntityPositionData;
};

export type FieldIdentifier = {
  entityIndex: number;
  fieldIndex: number;
};

export const COMMON_FIELDS: models.ResourceCreateWithEntitiesFieldInput[] = [
  {
    name: "ID",
    dataType: models.EnumDataType.Id,
  },
  {
    name: "Created At",
    dataType: models.EnumDataType.CreatedAt,
  },
  {
    name: "Updated At",
    dataType: models.EnumDataType.UpdatedAt,
  },
];

export const keyMap = {
  CLOSE_MODAL: ["enter", "esc"],
};

const ZOOM_LEVEL_STEP = 0.1;
const ZOOM_LEVEL_MIN = 0.2;
const ZOOM_LEVEL_MAX = 2;

const DEFAULT_ENTITY_WIDTH = 200;
const DEFAULT_ENTITY_HEIGHT = 300;
const DEFAULT_ENTITY_HORIZONTAL_GAP = 200;
const DEFAULT_ENTITY_VERTICAL_GAP = 50;

export const CLASS_NAME = "entities-diagram";

export default function EntitiesDiagram() {
  const [error, setError] = useState<Error | null>(null);

  const { setFieldValue, values } = useFormikContext<EntitiesDiagramFormData>();
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const zoomIn = useCallback(() => {
    setZoomLevel((zoomLevel) => {
      if (zoomLevel < ZOOM_LEVEL_MAX) return zoomLevel + ZOOM_LEVEL_STEP;
      return zoomLevel;
    });
  }, []);
  const zoomOut = useCallback(() => {
    setZoomLevel((zoomLevel) => {
      if (zoomLevel > ZOOM_LEVEL_MIN) return zoomLevel - ZOOM_LEVEL_STEP;
      return zoomLevel;
    });
  }, []);

  const zoomReset = useCallback(() => {
    setZoomLevel(1);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const [editedField, setEditedField] = React.useState<FieldIdentifier | null>(
    null
  );

  const [editedEntity, setEditedEntity] = React.useState<number | null>(0);

  const resetEditableElements = useCallback(() => {
    setEditedEntity(null);
    setEditedField(null);
    setError(null);
  }, [setEditedEntity, setEditedField]);

  const handleEditEntity = useCallback(
    (entityIndex: number | null) => {
      setEditedEntity(entityIndex);
      setEditedField(null);
    },
    [setEditedEntity, setEditedField]
  );

  const handleEditField = useCallback(
    (fieldIdentifier: FieldIdentifier | null) => {
      setEditedField(fieldIdentifier);
      setEditedEntity(null);
    },
    [setEditedEntity, setEditedField]
  );

  const onFieldDragStart = useCallback(() => {
    resetEditableElements();
  }, [resetEditableElements]);

  const onFieldDragEnd = useCallback(
    (result: DropResult) => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      const [sourceEntityIndex, sourceFieldIndex] = result.draggableId.split(
        "_"
      );
      const [, destinationEntityIndex] = result.destination.droppableId.split(
        "_"
      );
      const destinationFieldIndex = result.destination.index;

      const sourceFields = values.entities[Number(sourceEntityIndex)].fields;
      const [sourceField] = sourceFields.splice(Number(sourceFieldIndex), 1);

      setFieldValue(`entities.${sourceEntityIndex}.fields`, [...sourceFields]);

      const destinationFields =
        values.entities[Number(destinationEntityIndex)].fields;

      destinationFields.splice(destinationFieldIndex, 0, sourceField);

      setFieldValue(`entities.${destinationEntityIndex}.fields`, [
        ...destinationFields,
      ]);

      resetEditableElements();
    },
    [values, setFieldValue, resetEditableElements]
  );

  const [entitiesPosition, setEntitiesPosition] = useState<
    EntitiesPositionData
  >({
    0: {
      top: 0,
      left: 0,
      width: DEFAULT_ENTITY_WIDTH,
      height: DEFAULT_ENTITY_HEIGHT,
    },
  });

  //used to force redraw the arrows (the internal lists of fields are not updated since it used  )
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleEntityDrag = useCallback(
    (entityIndex: number, draggableData: DraggableData) => {
      resetEditableElements();
      setEntitiesPosition((current) => {
        const position = current[entityIndex] || { top: 0, left: 0 };
        const deltaX = draggableData.deltaX / zoomLevel;
        const deltaY = draggableData.deltaY / zoomLevel;

        const newPosition = {
          top: position.top + deltaY > 0 ? position.top + deltaY : 0,
          left: position.left + deltaX > 0 ? position.left + deltaX : 0,
          width: draggableData.node.offsetWidth,
          height: draggableData.node.offsetHeight,
        };

        current[entityIndex] = newPosition;

        return current;
      });

      forceUpdate();
    },
    [forceUpdate, resetEditableElements, zoomLevel]
  );

  const handleDeleteEntity = useCallback(
    (entityIndex: number) => {
      setError(null);

      const clonedEntities = cloneDeep(values.entities);
      const relations =
        clonedEntities[entityIndex].relationsToEntityIndex || [];
      const currentEntity = clonedEntities[entityIndex];

      const clonedPositions = cloneDeep(entitiesPosition);

      if (isEmpty(currentEntity.fields) && isEmpty(relations)) {
        const newPositions = Object.fromEntries(
          Object.keys(clonedPositions).flatMap((key) => {
            const KeyNumber = parseInt(key);
            if (KeyNumber < entityIndex) {
              return [[KeyNumber, clonedPositions[KeyNumber]]];
            } else if (KeyNumber === entityIndex) {
              return [];
            } else {
              return [[KeyNumber - 1, clonedPositions[KeyNumber]]];
            }
          })
        );

        clonedEntities.splice(entityIndex, 1);

        clonedEntities.map((entity) => {
          entity.relationsToEntityIndex = entity.relationsToEntityIndex?.flatMap(
            (index) => {
              return index < entityIndex
                ? [index]
                : index === entityIndex
                ? []
                : [index - 1];
            }
          );
          return entity;
        });

        setEntitiesPosition(newPositions);
        setFieldValue(`entities`, [...clonedEntities]);
      } else {
        setError(
          new Error(
            "To delete an entity, first remove all its fields and relations"
          )
        );
      }
    },
    [values, entitiesPosition, setFieldValue, setEntitiesPosition]
  );

  const handleAddEntity = useCallback(
    (entityIndex: number) => {
      const entities = cloneDeep(values.entities);
      const currentLength = entities.length;
      const relations = entities[entityIndex].relationsToEntityIndex || [];
      const currentEntity = entities[entityIndex];

      currentEntity.relationsToEntityIndex = [...relations, currentLength];

      const clonedPositions = cloneDeep(entitiesPosition);
      const sourcePosition = clonedPositions[entityIndex];

      const newLeft =
        sourcePosition.left +
        sourcePosition.width +
        DEFAULT_ENTITY_HORIZONTAL_GAP;
      const newRight = newLeft + DEFAULT_ENTITY_WIDTH;
      const minMaxValues: number[] = [];

      Object.entries(clonedPositions).forEach(([key, value]) => {
        if (!(value.left > newRight || value.left + value.width < newLeft)) {
          minMaxValues.push(value.top);
          minMaxValues.push(value.top + value.height);
        }
      });

      const min = Math.min(...minMaxValues);
      const max = Math.max(...minMaxValues);

      let newTop = 0;

      if (min >= DEFAULT_ENTITY_HEIGHT + DEFAULT_ENTITY_VERTICAL_GAP) {
        newTop = 0;
      } else {
        newTop = max + DEFAULT_ENTITY_VERTICAL_GAP;
      }

      const newPosition = {
        top: newTop,
        left: newLeft,
        width: DEFAULT_ENTITY_WIDTH,
        height: DEFAULT_ENTITY_HEIGHT,
      };
      clonedPositions[currentLength] = newPosition;

      setEntitiesPosition(clonedPositions);

      setFieldValue(`entities`, [
        ...entities,
        {
          name: "",
          fields: [],
        },
      ]);
      resetEditableElements();
      setEditedEntity(currentLength);
    },
    [setFieldValue, values.entities, resetEditableElements, entitiesPosition]
  );

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__toolbar`}>
        <Button
          className={`${CLASS_NAME}__toolbar__button`}
          buttonStyle={EnumButtonStyle.Text}
          type="button"
          onClick={zoomIn}
          icon="zoom_in"
        />
        <Button
          className={`${CLASS_NAME}__toolbar__button`}
          buttonStyle={EnumButtonStyle.Text}
          type="button"
          onClick={zoomOut}
          icon="zoom_out"
        />

        <Button
          className={`${CLASS_NAME}__toolbar__button`}
          buttonStyle={EnumButtonStyle.Text}
          type="button"
          onClick={zoomReset}
          icon="maximize_2"
        />
      </div>
      <div className={`${CLASS_NAME}__scroll`}>
        <div className={`${CLASS_NAME}__scroll-content`}>
          <EntitiesDiagramRelations entities={values.entities} />

          <div
            className={`${CLASS_NAME}__scale`}
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <DragDropContext
              onDragEnd={onFieldDragEnd}
              onDragStart={onFieldDragStart}
            >
              {values.entities.map((entity, index) => (
                <EntitiesDiagramEntity
                  zoomLevel={zoomLevel}
                  key={`entity_${index}`}
                  entity={entity}
                  entityIndex={index}
                  positionData={entitiesPosition[index]}
                  onDrag={handleEntityDrag}
                  onEditField={handleEditField}
                  onEditEntity={handleEditEntity}
                  onAddEntity={handleAddEntity}
                  onDeleteEntity={handleDeleteEntity}
                  editedFieldIdentifier={editedField}
                  editedEntity={editedEntity}
                />
              ))}
            </DragDropContext>
          </div>
        </div>
      </div>
      <Snackbar
        open={Boolean(error)}
        message={error?.message}
        onClose={clearError}
      />
    </div>
  );
}
