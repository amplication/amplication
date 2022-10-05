import { SelectField, TextField, Icon } from "@amplication/design-system";
import classNames from "classnames";
import React, { useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import { HotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../Components/Button";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "../Entity/constants";
import { DATA_TYPE_OPTIONS } from "../Entity/DataTypeSelectField";
import * as models from "../models";
import { FieldIdentifier, CLASS_NAME, keyMap } from "./EntitiesDiagram";

type Props = {
  field: models.ResourceCreateWithEntitiesFieldInput;
  entityIndex: number;
  fieldIndex: number;
  editedFieldIdentifier: FieldIdentifier | null;
  onEdit: (fieldIdentifier: FieldIdentifier | null) => void;
};

export const EntitiesDiagramField = React.memo(
  ({
    field,
    entityIndex,
    fieldIndex,
    editedFieldIdentifier,
    onEdit,
  }: Props) => {
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
                icon={DATA_TYPE_TO_LABEL_AND_ICON[dataType].icon}
                size="xsmall"
              />
              <span>{field.name}</span>
              <span className="spacer" />
              <Button
                className={`${CLASS_NAME}__fields__field__edit`}
                buttonStyle={EnumButtonStyle.Text}
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
                      autoComplete="off"
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
