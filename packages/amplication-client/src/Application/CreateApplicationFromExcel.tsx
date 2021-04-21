import React, { useCallback, useEffect } from "react";
import { isEmpty, forEach } from "lodash";
import { gql, useMutation } from "@apollo/client";
import * as XLSX from "xlsx";
import { Icon } from "@rmwc/icon";
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
import { DATA_TYPE_TO_LABEL_AND_ICON } from "../Entity/constants";

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
  const [fileName, setFileName] = React.useState<string>("");

  const { trackEvent } = useTracking();

  const history = useHistory();
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

  const handleSubmit = useCallback(() => {
    const data: models.AppCreateWithEntitiesInput = {
      app: {
        name: "imported app333",
        description: "description",
      },
      commitMessage: "my commit message",
      entities: [
        {
          name: "excel file",
          fields: importList.map((field) => ({
            name: field.fieldName,
            dataType: field.fieldType,
          })),
        },
      ],
    };

    createAppWithEntities({ variables: { data } }).catch(console.error);
  }, [createAppWithEntities, importList]);

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

  return (
    <MainLayout>
      <MainLayout.Menu />
      <MainLayout.Content>
        <PageContent className={CLASS_NAME}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
          <h3>{fileName}</h3>
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            disabled={loading}
            type="button"
            onClick={handleSubmit}
          >
            Import
          </Button>
          {loading && (
            <div className={`${CLASS_NAME}__loader`}>
              <CircularProgress />
            </div>
          )}
          <ShowFields fields={importList} />
          <Snackbar open={Boolean(error)} message={errorMessage} />
        </PageContent>
      </MainLayout.Content>
    </MainLayout>
  );
}

function ShowFields({ fields }: { fields: ImportField[] }) {
  return (
    <div>
      {fields.map((field, index) => (
        <div key={index}>
          <h3>
            <Icon icon={DATA_TYPE_TO_LABEL_AND_ICON[field.fieldType].icon} />{" "}
            {field.fieldName}
          </h3>
          <div>{DATA_TYPE_TO_LABEL_AND_ICON[field.fieldType].label}</div>
          <div>
            Sample Data:{" "}
            {field.sampleData.map((sampleItem) => `${sampleItem}, `)}
          </div>
          <br />
        </div>
      ))}
    </div>
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
