import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import classNames from "classnames";
import { isEmpty, forEach, cloneDeep } from "lodash";
import omitDeep from "deepdash-es/omitDeep";

import { FieldArray, Formik, useFormikContext } from "formik";
import { Form } from "../Components/Form";
import { gql, useMutation } from "@apollo/client";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import * as models from "../models";
import MainLayout from "../Layout/MainLayout";
import "./CreateApplicationFromExcel.scss";
import { useHistory } from "react-router-dom";
import { useTracking } from "../util/analytics";
import { GET_APPLICATIONS } from "./Applications";
import { formatError } from "../util/error";
import { Snackbar } from "@rmwc/snackbar";
import { Button, EnumButtonStyle } from "../Components/Button";
import { CircularProgress } from "@rmwc/circular-progress";
import { DisplayNameField } from "../Components/DisplayNameField";
import Xarrow from "react-xarrows";
import { SvgThemeImage, EnumImages } from "../Components/SvgThemeImage";

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

type ColumnKey = {
  name: string;
  key: number;
};

type WorksheetRow = unknown[];
type WorksheetData = WorksheetRow[];

type ImportField = {
  fieldName: string;
  fieldType: models.EnumDataType;
  sampleData: unknown[];
  importable: boolean;
};

type TData = {
  createAppWithEntities: models.App;
};

type EntityWithViewData = models.AppCreateWithEntitiesEntityInput & {
  level?: number;
  levelIndex?: number;
};

type FormData = models.AppCreateWithEntitiesInput & {
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

const CLASS_NAME = "create-application-from-excel";
const MAX_SAMPLE_DATA = 3;

export function CreateApplicationFromExcel() {
  const [importList, setImportList] = React.useState<ImportField[]>([]);
  const [fileName, setFileName] = React.useState<string | null>(null);

  const { trackEvent } = useTracking();

  const history = useHistory();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = () => {
      setFileName(acceptedFiles[0].name);
      const wb = XLSX.read(reader.result, {
        type: rABS ? "binary" : "array",
      });
      /* Get first worksheet */
      const worksheetName = wb.SheetNames[0];
      const ws = wb.Sheets[worksheetName];
      /* Convert array of arrays */
      const jsonData = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        blankrows: false,
      });

      const [headers, ...rest] = jsonData;

      const columns = generateColumnKeys(ws["!ref"]);
      buildImportList(rest as WorksheetData, headers as string[], columns);
    };

    // read file contents
    acceptedFiles.forEach((file) => reader.readAsBinaryString(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: SheetAcceptedFormats,
    maxFiles: 1,
    onDrop,
  });

  const [createAppWithEntities, { loading, data, error }] = useMutation<TData>(
    CREATE_APP_WITH_ENTITIES,
    {
      onCompleted: (data) => {
        trackEvent({
          eventName: "createAppFromFile",
          appName: data.createAppWithEntities.name,
        });
      },
      update(cache, { data }) {
        if (!data) return;
        const queryData = cache.readQuery<{ apps: Array<models.App> }>({
          query: GET_APPLICATIONS,
        });
        if (queryData === null) {
          return;
        }
        cache.writeQuery({
          query: GET_APPLICATIONS,
          data: {
            apps: queryData.apps.concat([data.createAppWithEntities]),
          },
        });
      },
    }
  );

  const clearSelectedFile = useCallback(() => {
    setFileName(null);
  }, [setFileName]);

  const initialValues = useMemo(() => {
    const fileNameWithoutExtension = fileName?.replace(/\.[^/.]+$/, "");

    const data: FormData = {
      app: {
        name: fileNameWithoutExtension || "",
        description: fileNameWithoutExtension || "",
      },
      commitMessage: `Import schema from ${fileName}`,
      entities: [
        {
          name: fileNameWithoutExtension || "",
          fields: importList.map((field) => ({
            name: field.fieldName,
            dataType: field.fieldType,
          })),
        },
      ],
    };

    return data;
  }, [importList, fileName]);

  const handleSubmit = useCallback(
    (data: FormData) => {
      const sanitizedData: models.AppCreateWithEntitiesInput = omitDeep(data, [
        "level",
        "levelIndex",
      ]);
      createAppWithEntities({ variables: { data: sanitizedData } }).catch(
        console.error
      );
    },
    [createAppWithEntities]
  );

  const errorMessage = formatError(error);

  useEffect(() => {
    if (data) {
      history.push(`/${data.createAppWithEntities.id}`);
    }
  }, [history, data]);

  const buildImportList = (
    data: WorksheetData,
    headers: string[],
    columns: ColumnKey[]
  ) => {
    const fields: ImportField[] = [];
    for (const column of columns) {
      if (!isEmpty(headers[column.key])) {
        const sampleData = getColumnSampleData(
          data,
          MAX_SAMPLE_DATA,
          column.key
        );
        const fieldName = headers[column.key];
        let fieldType: models.EnumDataType = models.EnumDataType.SingleLineText;

        if (fieldName.toLowerCase().includes("date")) {
          fieldType = models.EnumDataType.DateTime;
        } else if (sampleData.some((value) => isNaN(+(value as any)))) {
          fieldType = models.EnumDataType.SingleLineText;
        } else {
          if (sampleData.every((value) => Number.isInteger(value))) {
            fieldType = models.EnumDataType.WholeNumber;
          } else {
            fieldType = models.EnumDataType.DecimalNumber;
          }
        }

        fields.push({
          fieldName,
          fieldType,
          sampleData,
          importable: true,
        });
      }
    }
    setImportList(fields);
  };

  return (
    <MainLayout>
      <MainLayout.Menu />
      <MainLayout.Content>
        <div className={CLASS_NAME}>
          <div className={`${CLASS_NAME}__layout`}>
            <div className={`${CLASS_NAME}__layout__toolbar`}>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                disabled={loading}
                type="button"
                onClick={clearSelectedFile}
              >
                Back
              </Button>
            </div>
            {isEmpty(fileName) ? (
              <div>
                <div className={`${CLASS_NAME}__header`}>
                  <SvgThemeImage image={EnumImages.ImportExcel} />
                  <h2>Import schema from excel</h2>
                  <div className={`${CLASS_NAME}__message`}>
                    Start building your application from an existing schema.
                    Just upload an excel or CSV file to import its schema, and
                    generate your node.JS application source code
                  </div>
                </div>

                <div
                  {...getRootProps()}
                  className={classNames(`${CLASS_NAME}__dropzone`, {
                    [`${CLASS_NAME}__dropzone--active`]: isDragActive,
                  })}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the file here ...</p>
                  ) : (
                    <p>Drag and drop a file here, or click to select a file</p>
                  )}
                </div>

                {loading && (
                  <div className={`${CLASS_NAME}__loader`}>
                    <CircularProgress />
                  </div>
                )}
              </div>
            ) : (
              <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={handleSubmit}
                render={({ values }) => (
                  <Form className={`${CLASS_NAME}__layout__body`}>
                    <div className={`${CLASS_NAME}__layout__body__side`}>
                      <div className={`${CLASS_NAME}__message`}>
                        Name your application, and edit the schema if needed.
                        You can also change the settings later. Click on "Create
                        App" when you are ready.
                      </div>

                      <h3>{fileName}</h3>

                      <DisplayNameField
                        name="app.name"
                        label="Application Name"
                        required
                      />

                      <Button
                        buttonStyle={EnumButtonStyle.Primary}
                        disabled={loading}
                        type="submit"
                      >
                        Create App
                      </Button>
                    </div>

                    <div className={`${CLASS_NAME}__layout__body__content`}>
                      <div className={`${CLASS_NAME}__entities`}>
                        <DragDropEntitiesCanvas />
                      </div>
                    </div>
                  </Form>
                )}
              />
            )}
            <Snackbar open={Boolean(error)} message={errorMessage} />
          </div>
        </div>
      </MainLayout.Content>
    </MainLayout>
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
  onEditEntity: (entityIndex: number) => void;
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
              {entity.name}
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
                  <TextField
                    name={`entities.${entityIndex}.name`}
                    label="
                    Entity Name"
                    required
                  />
                </div>
              )}
            </div>

            <FieldArray
              name={`entities.${entityIndex}.fields`}
              render={(fieldsArrayHelpers) => (
                <div className={`${CLASS_NAME}__fields`}>
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

    return (
      <Draggable
        key={`${entityIndex}_${fieldIndex}`}
        draggableId={`${entityIndex}_${fieldIndex}`}
        index={fieldIndex}
      >
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <div
              className={classNames(`${CLASS_NAME}__fields__field`, {
                [`${CLASS_NAME}__fields__field--selected`]: selected,
              })}
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
                  <TextField
                    name={`entities.${entityIndex}.fields.${fieldIndex}.name`}
                    label="Field Name"
                    required
                  />

                  <SelectField
                    label="Data Type"
                    name={`entities.${entityIndex}.fields.${fieldIndex}.dataType`}
                    options={DATA_TYPE_OPTIONS}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  }
);

function DragDropEntitiesCanvas() {
  const { setFieldValue, values } = useFormikContext<FormData>();

  const [editedField, setEditedField] = React.useState<FieldIdentifier | null>(
    null
  );

  const [editedEntity, setEditedEntity] = React.useState<number | null>(null);

  const resetEditableElements = useCallback(() => {
    setEditedEntity(null);
    setEditedField(null);
  }, [setEditedEntity, setEditedField]);

  const handleEditEntity = useCallback(
    (entityIndex: number) => {
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
          name: "new entity",
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
    },
    [setFieldValue, values.entities, resetEditableElements]
  );

  return (
    <>
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
    </>
  );
}

/* list of supported file types */
// cSpell: disable
const SheetAcceptedFormats = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm",
]
  .map((x) => `.${x}`)
  .join(",");
// cSpell: enable

const generateColumnKeys = (range: string | undefined): ColumnKey[] => {
  if (undefined === range) return [];
  let keys = [],
    TotalColumns = XLSX.utils.decode_range(range).e.c + 1;

  for (var i = 0; i < TotalColumns; ++i)
    keys[i] = { name: XLSX.utils.encode_col(i), key: i };

  return keys;
};

function getColumnSampleData(
  data: WorksheetData,
  maxCount: number,
  columnKey: number
): unknown[] {
  const results: unknown[] = [];
  forEach(data, function (row) {
    if (results.length === maxCount) {
      return false;
    }
    if (undefined !== row[columnKey]) {
      results.push(row[columnKey]);
    }
  });
  return results;
}

const CREATE_APP_WITH_ENTITIES = gql`
  mutation createAppWithEntities($data: AppCreateWithEntitiesInput!) {
    createAppWithEntities(data: $data) {
      id
      name
      description
    }
  }
`;
