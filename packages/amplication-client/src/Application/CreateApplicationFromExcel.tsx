import React, { useCallback } from "react";
import { isEmpty, forEach } from "lodash";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import * as models from "../models";
import PageContent from "../Layout/PageContent";
import MainLayout from "../Layout/MainLayout";
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

const CLASS_NAME = "create-application-from-excel";
const MAX_SAMPLE_DATA = 3;

export function CreateApplicationFromExcel() {
  const [importList, setImportList] = React.useState<ImportField[]>([]);
  const [fileName, setFileName] = React.useState<string>("");

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
        raw: true,
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

          <ShowFields fields={importList} />
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
          <div>Field Name: {field.fieldName}</div>
          <div>Data Type: {field.fieldType}</div>
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
