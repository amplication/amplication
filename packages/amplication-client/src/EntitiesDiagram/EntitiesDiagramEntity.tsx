import React, { useCallback } from "react";
import { Icon } from "@rmwc/icon";
import classNames from "classnames";
import { FieldArray } from "formik";
import { Droppable } from "react-beautiful-dnd";
import { DraggableCore, DraggableData, DraggableEvent } from "react-draggable";
import { HotKeys } from "react-hotkeys";
import { TextField } from "@amplication/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import {
  CLASS_NAME,
  COMMON_FIELDS,
  EntityPositionData,
  FieldIdentifier,
  keyMap,
} from "./EntitiesDiagram";
import { EntitiesDiagramField } from "./EntitiesDiagramField";
import { EntitiesDiagramStaticField } from "./EntitiesDiagramStaticField";

type Props = {
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
export const EntitiesDiagramEntity = React.memo(
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
  }: Props) => {
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
                    <EntitiesDiagramStaticField
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
                          <EntitiesDiagramField
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
