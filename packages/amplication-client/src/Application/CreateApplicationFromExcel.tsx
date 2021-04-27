import { gql, useMutation } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import { Snackbar } from "@rmwc/snackbar";
import classNames from "classnames";
import omitDeep from "deepdash-es/omitDeep";
import { Formik } from "formik";
import { forEach, isEmpty } from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useHistory } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button, EnumButtonStyle } from "../Components/Button";
import { DisplayNameField } from "../Components/DisplayNameField";
import { Form } from "../Components/Form";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import EntitiesDiagram, {
  COMMON_FIELDS,
  EntitiesDiagramFormData,
} from "../EntitiesDiagram/EntitiesDiagram";
import MainLayout from "../Layout/MainLayout";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";
import { GET_APPLICATIONS } from "./Applications";
import "./CreateApplicationFromExcel.scss";

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
    const fileNameWithoutExtension = fileName?.replace(/\.[^/.]+$/, "");

    const data: EntitiesDiagramFormData = {
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
    (data: EntitiesDiagramFormData) => {
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
        const fieldName = headers[column.key];
        if (
          !COMMON_FIELDS.find(
            (commonField) =>
              commonField.name.toLowerCase() === fieldName.toLowerCase()
          )
        ) {
          const sampleData = getColumnSampleData(
            data,
            MAX_SAMPLE_DATA,
            column.key
          );

          let fieldType: models.EnumDataType =
            models.EnumDataType.SingleLineText;

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
    }
    setImportList(fields);
  };

  return (
    <MainLayout>
      <MainLayout.Menu />
      <MainLayout.Content>
        <div className={CLASS_NAME}>
          <div className={`${CLASS_NAME}__layout`}>
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
                render={({ values, handleSubmit }) => (
                  <Form className={`${CLASS_NAME}__layout__body`}>
                    <div className={`${CLASS_NAME}__layout__body__side`}>
                      <h3>{fileName}</h3>
                      <ul
                        className={`${CLASS_NAME}__layout__body__side__message`}
                      >
                        <li>
                          You can change the name and the data type of your
                          fields
                        </li>
                        <li>
                          You can create additional entities and move fields
                          between entities to normalize your data model
                        </li>
                        <li>
                          All relations are created as one-to-many by default.
                          You can change that later if needed.
                        </li>
                        <li>
                          You can update anything in your data models after you
                          created the app
                        </li>
                        <li>
                          Give your app a descriptive name and click on "Create
                          App" below
                        </li>
                      </ul>

                      <DisplayNameField
                        name="app.name"
                        label="Application Name"
                        required
                      />

                      <Button
                        buttonStyle={EnumButtonStyle.Primary}
                        disabled={loading}
                        onClick={handleSubmit}
                        type="button"
                      >
                        Create App
                      </Button>
                    </div>

                    <div className={`${CLASS_NAME}__layout__body__content`}>
                      <div
                        className={`${CLASS_NAME}__layout__body__content__toolbar`}
                      >
                        <Button
                          buttonStyle={EnumButtonStyle.Clear}
                          disabled={loading}
                          type="button"
                          onClick={clearSelectedFile}
                        >
                          Back
                        </Button>
                      </div>
                      <div className={`${CLASS_NAME}__entities`}>
                        <EntitiesDiagram />
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
