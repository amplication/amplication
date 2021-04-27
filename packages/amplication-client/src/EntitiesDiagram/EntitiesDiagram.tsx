import { useFormikContext } from "formik";
import { cloneDeep } from "lodash";
import React, { useCallback, useReducer, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { DraggableData } from "react-draggable";
import * as models from "../models";
import "./EntitiesDiagram.scss";
import { EntitiesDiagramRelations } from "./EntitiesDiagramRelations";
import { EntitiesDiagramEntity } from "./EntitiesDiagramEntity";

type EntityWithViewData = models.AppCreateWithEntitiesEntityInput & {
  level?: number;
  levelIndex?: number;
};

export type EntitiesDiagramFormData = models.AppCreateWithEntitiesInput & {
  entities: EntityWithViewData[];
};

export type EntityPositionData = {
  top: number;
  left: number;
};

type EntitiesPositionData = {
  [index: number]: EntityPositionData;
};

export type FieldIdentifier = {
  entityIndex: number;
  fieldIndex: number;
};

export const COMMON_FIELDS: models.AppCreateWithEntitiesFieldInput[] = [
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

export const CLASS_NAME = "entities-diagram";

export default function EntitiesDiagram() {
  const { setFieldValue, values } = useFormikContext<EntitiesDiagramFormData>();

  const [editedField, setEditedField] = React.useState<FieldIdentifier | null>(
    null
  );

  const [editedEntity, setEditedEntity] = React.useState<number | null>(0);

  const resetEditableElements = useCallback(() => {
    setEditedEntity(null);
    setEditedField(null);
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
  >({ 0: { top: 0, left: 0 } });

  //used to force redraw the arrows (the internal lists of fields are not updated since it used  )
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleEntityDrag = useCallback(
    (entityIndex: number, draggableData: DraggableData) => {
      resetEditableElements();
      setEntitiesPosition((current) => {
        const position = current[entityIndex] || { top: 0, left: 0 };
        const newPosition = {
          top:
            position.top + draggableData.deltaY > 0
              ? position.top + draggableData.deltaY
              : 0,
          left:
            position.left + draggableData.deltaX > 0
              ? position.left + draggableData.deltaX
              : 0,
        };

        current[entityIndex] = newPosition;

        return current;
      });

      forceUpdate();
    },
    [forceUpdate, resetEditableElements]
  );

  const handleAddEntity = useCallback(
    (entityIndex: number) => {
      const entities: EntityWithViewData[] = cloneDeep(values.entities);
      const currentLength = entities.length;
      const relations = entities[entityIndex].relationsToEntityIndex || [];
      const currentEntity = entities[entityIndex];

      const newEntityLevel = currentEntity.level ? currentEntity.level + 1 : 1;

      const levelEntities = entities.filter(
        (entity) => entity.level === newEntityLevel
      );

      const levelIndex = levelEntities.length;

      currentEntity.relationsToEntityIndex = [...relations, currentLength];

      setFieldValue(`entities`, [
        ...entities,
        {
          name: "",
          fields: [],
          level: newEntityLevel,
          levelIndex: levelIndex,
        },
      ]);

      setEntitiesPosition((current) => {
        const position = current[entityIndex];
        const newPosition = {
          top: position.top,
          left: position.left + 300,
        };

        current[currentLength] = newPosition;

        return current;
      });
      resetEditableElements();
      setEditedEntity(currentLength);
    },
    [setFieldValue, values.entities, resetEditableElements]
  );

  return (
    <div className={CLASS_NAME}>
      <EntitiesDiagramRelations entities={values.entities} />
      <DragDropContext
        onDragEnd={onFieldDragEnd}
        onDragStart={onFieldDragStart}
      >
        {values.entities.map((entity, index) => (
          <EntitiesDiagramEntity
            key={`entity_${index}`}
            entity={entity}
            entityIndex={index}
            positionData={entitiesPosition[index]}
            onDrag={handleEntityDrag}
            onEditField={handleEditField}
            onEditEntity={handleEditEntity}
            onAddEntity={handleAddEntity}
            editedFieldIdentifier={editedField}
            editedEntity={editedEntity}
          />
        ))}
      </DragDropContext>
    </div>
  );
}


