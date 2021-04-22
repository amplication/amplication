import React, { useCallback, useEffect, useMemo } from "react";
import classNames from "classnames";
import { isEmpty, forEach } from "lodash";
import { FieldArray, Formik, useFormikContext } from "formik";
import { Form } from "../Components/Form";
import { gql, useMutation } from "@apollo/client";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import * as models from "../models";
import PageContent from "../Layout/PageContent";
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
// import { DATA_TYPE_OPTIONS } from "../Entity/DataTypeSelectField";
// import { SelectField } from "@amplication/design-system";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvidedDragHandleProps,
  DropResult,
} from "react-beautiful-dnd";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "../Entity/constants";
import EditableLabelField from "../Components/EditableLabelField";

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
    const data: models.AppCreateWithEntitiesInput = {
      app: {
        name: fileName || "",
        description: fileName || "",
      },
      commitMessage: `Import schema from ${fileName}`,
      entities: [
        {
          name: fileName || "",
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
    (data: models.AppCreateWithEntitiesInput) => {
      createAppWithEntities({ variables: { data } }).catch(console.error);
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
        } else if (sampleData.some((value) => isNaN(+value))) {
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

  const getListStyle = (isDraggingOver) => ({
    height: "100%",
    minHeight: 200,
  });

  return (
    <MainLayout>
      <MainLayout.Menu />
      <MainLayout.Content>
        <PageContent className={CLASS_NAME}>
          <div className={`${CLASS_NAME}__header`}>
            <h2>Import schema from excel</h2>

            <span className="spacer" />
          </div>

          {isEmpty(fileName) ? (
            <>
              <div className={`${CLASS_NAME}__message`}>
                Start building your application from an existing schema. Just
                upload an excel or CSV file to import its schema, and generate
                your node.JS application source code
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
            </>
          ) : (
            <>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                disabled={loading}
                type="button"
                onClick={clearSelectedFile}
              >
                Back
              </Button>

              <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={handleSubmit}
                render={({ values }) => (
                  <Form>
                    <div className={`${CLASS_NAME}__header`}>
                      <div className={`${CLASS_NAME}__message`}>
                        Name your application, and edit the schema if needed.
                        You can also change the settings later. Click on "Create
                        App" when you are ready.
                      </div>
                      <Button
                        buttonStyle={EnumButtonStyle.Primary}
                        disabled={loading}
                        type="button"
                      >
                        Create App
                      </Button>
                    </div>

                    <h3>{fileName}</h3>

                    <DisplayNameField
                      name="app.name"
                      label="Application Name"
                      required
                    />

                    <FieldArray
                      name="entities"
                      render={(arrayHelpers) => (
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.push({
                                name: "new entity",
                                fields: [
                                  {
                                    name: "field1",
                                    dataType: null,
                                  },
                                ],
                              })
                            }
                          >
                            +
                          </button>

                          <div className={`${CLASS_NAME}__entities`}>
                            <DragDropFormContext>
                              {values.entities.map((entity, index) => (
                                <div
                                  key={`entity_${index}`}
                                  className={`${CLASS_NAME}__entities__entity`}
                                >
                                  <div
                                    className={`${CLASS_NAME}__entities__entity__name`}
                                  >
                                    <EditableLabelField
                                      name={`entities.${index}.name`}
                                      label="Entity Name"
                                      required
                                    />
                                  </div>

                                  <FieldArray
                                    name={`entities.${index}.fields`}
                                    render={(fieldsArrayHelpers) => (
                                      <div className={`${CLASS_NAME}__fields`}>
                                        <Droppable
                                          droppableId={`droppable_${index}`}
                                        >
                                          {(provided, snapshot) => (
                                            <div
                                              {...provided.droppableProps}
                                              ref={provided.innerRef}
                                              className={classNames(
                                                `${CLASS_NAME}__droppable`,
                                                {
                                                  [`${CLASS_NAME}__droppable--over`]: snapshot.isDraggingOver,
                                                }
                                              )}
                                            >
                                              {values.entities[
                                                index
                                              ].fields.map(
                                                (field, fieldIndex) => (
                                                  <Draggable
                                                    key={`${index}_${fieldIndex}`}
                                                    draggableId={`${index}_${fieldIndex}`}
                                                    index={fieldIndex}
                                                  >
                                                    {(provided, snapshot) => (
                                                      <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                      >
                                                        <FieldItem
                                                          dragHandleProps={
                                                            provided.dragHandleProps
                                                          }
                                                          values={values}
                                                          key={`entity_${index}_field_${fieldIndex}`}
                                                          entityIndex={index}
                                                          fieldIndex={
                                                            fieldIndex
                                                          }
                                                          loading={loading}
                                                          onMoveToNewEntity={() => {}}
                                                        />
                                                      </div>
                                                    )}
                                                  </Draggable>
                                                )
                                              )}

                                              {provided.placeholder}
                                            </div>
                                          )}
                                        </Droppable>
                                      </div>
                                    )}
                                  />
                                </div>
                              ))}
                            </DragDropFormContext>
                          </div>
                        </div>
                      )}
                    />
                  </Form>
                )}
              />
            </>
          )}
          <Snackbar open={Boolean(error)} message={errorMessage} />
        </PageContent>
      </MainLayout.Content>
    </MainLayout>
  );
}

type FieldItemProps = {
  values: models.AppCreateWithEntitiesInput;
  entityIndex: number;
  fieldIndex: number;
  loading: boolean;
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
  onMoveToNewEntity: (entityIndex: number, fieldIndex: number) => void;
};

function FieldItem({
  values,
  entityIndex,
  fieldIndex,
  loading,
  dragHandleProps,
}: FieldItemProps) {
  const dataType =
    values.entities[entityIndex].fields[fieldIndex].dataType ||
    models.EnumDataType.SingleLineText;

  return (
    <div className={`${CLASS_NAME}__fields__field`} {...dragHandleProps}>
      <Icon
        icon={{
          icon: DATA_TYPE_TO_LABEL_AND_ICON[dataType].icon,
          size: "xsmall",
        }}
      />

      {values.entities[entityIndex].fields[fieldIndex].name}

      {/* <EditableLabelField
        name={`entities.${entityIndex}.fields.${fieldIndex}.name`}
        label="Field Name"
        required
      /> */}
      {/* 
      <SelectField
        label="Data Type"
        name={`entities.${entityIndex}.fields.${fieldIndex}.dataType`}
        options={DATA_TYPE_OPTIONS}
      />

      <Button
        buttonStyle={EnumButtonStyle.Clear}
        onClick={handleModeToNewEntity}
        disabled={loading}
        type="button"
      >
        Move to new entity
      </Button> */}
    </div>
  );
}

type DragDropFormContextProps = {
  children: React.ReactNode;
};

function DragDropFormContext(props: DragDropFormContextProps) {
  const { setFieldValue, values } = useFormikContext<
    models.AppCreateWithEntitiesInput
  >();

  const onDragEnd = useCallback(
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

      setFieldValue(`entities${sourceEntityIndex}.fields`, [...sourceFields]);

      const destinationFields =
        values.entities[Number(destinationEntityIndex)].fields;

      destinationFields.splice(destinationFieldIndex, 0, sourceField);

      setFieldValue(`entities${destinationEntityIndex}.fields`, [
        ...destinationFields,
      ]);
    },
    [values, setFieldValue]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>{props.children}</DragDropContext>
  );
}

/* list of supported file types */
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

const generateColumnKeys = (range: string): ColumnKey[] => {
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
  mutation createApp($data: AppCreateWithEntitiesInput!) {
    createAppWithEntities(data: $data) {
      id
      name
      description
    }
  }
`;
