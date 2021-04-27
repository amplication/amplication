import React, { useCallback, useMemo, useReducer, useState } from "react";
import classNames from "classnames";
import { cloneDeep } from "lodash";
import { HotKeys } from "react-hotkeys";

import { FieldArray, useFormikContext } from "formik";
import * as models from "../models";
import { Button, EnumButtonStyle } from "../Components/Button";
import Xarrow from "react-xarrows";

import { DATA_TYPE_OPTIONS } from "../Entity/DataTypeSelectField";
import { SelectField, TextField } from "@amplication/design-system";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "../Entity/constants";
import { DraggableCore, DraggableData, DraggableEvent } from "react-draggable";

import { Icon } from "@rmwc/icon";
import "./EntitiesDiagram.scss";

type EntityWithViewData = models.AppCreateWithEntitiesEntityInput & {
  level?: number;
  levelIndex?: number;
};

export type EntitiesDiagramFormData = models.AppCreateWithEntitiesInput & {
  entities: EntityWithViewData[];
};

type EntityPositionData = {
  top: number;
  left: number;
};

type EntitiesPositionData = {
  [index: number]: EntityPositionData;
};

type FieldIdentifier = {
  entityIndex: number;
  fieldIndex: number;
};

const ARROW_PROPS = {
  color: "white",
  strokeWidth: 2,
  headSize: 5,
  curveness: 0.7,
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

const keyMap = {
  CLOSE_MODAL: ["enter", "esc"],
};

const CLASS_NAME = "entities-diagram";

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
      <EntityRelations entities={values.entities} />
      <DragDropContext
        onDragEnd={onFieldDragEnd}
        onDragStart={onFieldDragStart}
      >
        {values.entities.map((entity, index) => (
          <EntityItem
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

type EntityRelationsProps = {
  entities: models.AppCreateWithEntitiesEntityInput[];
};

function EntityRelations({ entities }: EntityRelationsProps) {
  const relations = useMemo(() => {
    return entities.flatMap((entity, index) => {
      if (!entity.relationsToEntityIndex) return [];
      return entity.relationsToEntityIndex.map((relation) => ({
        key: `${index}_${relation}`,
        start: `entity${index}`,
        end: `entity${relation}`,
      }));
    });
  }, [entities]);

  return (
    <div>
      {relations.map((relation) => (
        <Xarrow {...relation} key={relation.key} {...ARROW_PROPS} />
      ))}
    </div>
  );
}

type EntityItemProps = {
  entity: models.AppCreateWithEntitiesEntityInput;
  entityIndex: number;
  editedFieldIdentifier: FieldIdentifier | null;
  editedEntity: number | null;
  positionData: EntityPositionData;
  onDrag?: (entityIndex: number, data: DraggableData) => void;
  onEditField: (fieldIdentifier: FieldIdentifier | null) => void;
  onEditEntity: (entityIndex: number | null) => void;
  onAddEntity: (entityIndex: number) => void;
};

const EntityItem = React.memo(
  ({
    entity,
    entityIndex,
    editedFieldIdentifier,
    editedEntity,
    positionData,
    onDrag,
    onEditField,
    onEditEntity,
    onAddEntity,
  }: EntityItemProps) => {
    const handleAddEntity = useCallback(() => {
      onAddEntity && onAddEntity(entityIndex);
    }, [entityIndex, onAddEntity]);

    const handleDrag = useCallback(
      (e: DraggableEvent, data: DraggableData) => {
        onDrag && onDrag(entityIndex, data);
      },
      [onDrag, entityIndex]
    );

    const handleEditEntity = useCallback(() => {
      onEditEntity && onEditEntity(entityIndex);
    }, [onEditEntity, entityIndex]);

    const selected = entityIndex === editedEntity;

    const handlers = {
      CLOSE_MODAL: () => {
        onEditEntity(null);
      },
    };

    return (
      <DraggableCore handle=".handle" onDrag={handleDrag}>
        <div
          id={`entity${entityIndex}`}
          className={`${CLASS_NAME}__entities__entity`}
          style={positionData}
        >
          <div>
            <div className={`${CLASS_NAME}__entities__entity__name `}>
              <Icon icon="menu" className="handle" />
              <span>{entity.name}</span>
              <span className="spacer" />
              <Button
                className={`${CLASS_NAME}__entities__entity__edit`}
                buttonStyle={EnumButtonStyle.Clear}
                type="button"
                onClick={handleEditEntity}
                icon="edit_2"
              />
              <Button
                className={`${CLASS_NAME}__entities__entity__add`}
                buttonStyle={EnumButtonStyle.Primary}
                onClick={handleAddEntity}
                type="button"
                icon="plus"
              />
              {selected && (
                <div className={`${CLASS_NAME}__entities__entity__edit-area`}>
                  <HotKeys keyMap={keyMap} handlers={handlers}>
                    <TextField
                      name={`entities.${entityIndex}.name`}
                      autoFocus
                      label="Entity Name"
                      placeholder="Entity Name"
                      required
                    />
                  </HotKeys>
                </div>
              )}
            </div>

            <FieldArray
              name={`entities.${entityIndex}.fields`}
              render={(fieldsArrayHelpers) => (
                <div className={`${CLASS_NAME}__fields`}>
                  {COMMON_FIELDS.map((field, fieldIndex) => (
                    <StaticFieldItem
                      key={`static_${entityIndex}_${fieldIndex}`}
                      field={field}
                    />
                  ))}
                  <Droppable droppableId={`droppable_${entityIndex}`}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={classNames(`${CLASS_NAME}__droppable`, {
                          [`${CLASS_NAME}__droppable--over`]: snapshot.isDraggingOver,
                        })}
                      >
                        {entity.fields.map((field, fieldIndex) => (
                          <FieldItem
                            key={`${entityIndex}_${fieldIndex}`}
                            field={field}
                            entityIndex={entityIndex}
                            fieldIndex={fieldIndex}
                            onEdit={onEditField}
                            editedFieldIdentifier={editedFieldIdentifier}
                          />
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              )}
            />
          </div>
        </div>
      </DraggableCore>
    );
  }
);

type StaticFieldItemProps = {
  field: models.AppCreateWithEntitiesFieldInput;
};

const StaticFieldItem = React.memo(({ field }: StaticFieldItemProps) => {
  const dataType = field.dataType || models.EnumDataType.SingleLineText;

  return (
    <div
      className={classNames(
        `${CLASS_NAME}__fields__field`,
        `${CLASS_NAME}__fields__field--static`
      )}
    >
      <Icon
        icon={{
          icon: DATA_TYPE_TO_LABEL_AND_ICON[dataType].icon,
          size: "xsmall",
        }}
      />
      <span>{field.name}</span>
      <span className="spacer" />
    </div>
  );
});

type FieldItemProps = {
  field: models.AppCreateWithEntitiesFieldInput;
  entityIndex: number;
  fieldIndex: number;
  editedFieldIdentifier: FieldIdentifier | null;
  onEdit: (fieldIdentifier: FieldIdentifier | null) => void;
};

const FieldItem = React.memo(
  ({
    field,
    entityIndex,
    fieldIndex,
    editedFieldIdentifier,
    onEdit,
  }: FieldItemProps) => {
    const dataType = field.dataType || models.EnumDataType.SingleLineText;

    const handleClick = useCallback(() => {
      onEdit && onEdit({ entityIndex, fieldIndex });
    }, [onEdit, entityIndex, fieldIndex]);

    const selected =
      editedFieldIdentifier &&
      editedFieldIdentifier.entityIndex === entityIndex &&
      editedFieldIdentifier.fieldIndex === fieldIndex;

    const handlers = {
      CLOSE_MODAL: () => {
        onEdit(null);
      },
    };

    return (
      <Draggable
        key={`${entityIndex}_${fieldIndex}`}
        draggableId={`${entityIndex}_${fieldIndex}`}
        index={fieldIndex}
      >
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <div
              className={classNames(
                `${CLASS_NAME}__fields__field`,
                {
                  [`${CLASS_NAME}__fields__field--selected`]: selected,
                },
                {
                  [`${CLASS_NAME}__fields__field--dragged`]: snapshot.isDragging,
                }
              )}
              {...provided.dragHandleProps}
            >
              <Icon
                icon={{
                  icon: DATA_TYPE_TO_LABEL_AND_ICON[dataType].icon,
                  size: "xsmall",
                }}
              />
              <span>{field.name}</span>
              <span className="spacer" />
              <Button
                className={`${CLASS_NAME}__fields__field__edit`}
                buttonStyle={EnumButtonStyle.Clear}
                type="button"
                onClick={handleClick}
                icon="edit_2"
              />
              {selected && (
                <div className={`${CLASS_NAME}__fields__field__edit-area`}>
                  <HotKeys keyMap={keyMap} handlers={handlers}>
                    <TextField
                      name={`entities.${entityIndex}.fields.${fieldIndex}.name`}
                      autoFocus
                      placeholder="Field Name"
                      label="Field Name"
                      required
                    />

                    <SelectField
                      label="Data Type"
                      name={`entities.${entityIndex}.fields.${fieldIndex}.dataType`}
                      options={DATA_TYPE_OPTIONS}
                    />
                  </HotKeys>
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  }
);
