import React, { useCallback, useEffect, useMemo, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useHistory, Link } from "react-router-dom";
import { Snackbar } from "@rmwc/snackbar";
import classNames from "classnames";
import { forEach, isEmpty } from "lodash";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import {
  COMMON_FIELDS,
  EntitiesDiagramFormData,
} from "../EntitiesDiagram/EntitiesDiagram";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";
import { GET_APPLICATIONS } from "../Workspaces/ApplicationList";
import "./CreateAppFromExcel.scss";
import { CreateAppFromExcelForm } from "./CreateAppFromExcelForm";
import { sampleAppWithEntities, sampleAppWithoutEntities } from "./constants";
import ProgressBar from "../Components/ProgressBar";
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

export const CLASS_NAME = "create-app-from-excel";
const MAX_SAMPLE_DATA = 3;

export function CreateAppFromExcel() {
  const [importList, setImportList] = useState<ImportField[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const { data: appsData } = useQuery<{
    apps: Array<models.App>;
  }>(GET_APPLICATIONS);
  const [generalError, setGeneralError] = useState<Error | undefined>(
    undefined
  );

  const clearGeneralError = useCallback(() => {
    setGeneralError(undefined);
  }, [setGeneralError]);

  const { trackEvent } = useTracking();

  const history = useHistory();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
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
        trackEvent({
          eventName: "uploadFileToImportSchema",
          appName: fileName,
        });
        buildImportList(rest as WorksheetData, headers as string[], columns);
      };

      // read file contents
      acceptedFiles.forEach((file) => reader.readAsBinaryString(file));
    },
    [trackEvent, fileName]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: SheetAcceptedFormats,
    maxFiles: 1,
    onDrop,
  });

  const appsExist = useMemo(() => {
    return appsData && !isEmpty(appsData.apps);
  }, [appsData]);

  const [createAppWithEntities, { loading, data, error }] = useMutation<TData>(
    CREATE_APP_WITH_ENTITIES,
    {
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

  const initialValues = useMemo((): EntitiesDiagramFormData => {
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
      if (data.entities.find((entity) => isEmpty(entity.name))) {
        setGeneralError(new Error("Entity name cannot be empty"));
        return;
      } else {
        const names = data.entities.map((entity) => entity.name);

        const duplicate = names.filter(
          (name, index, arr) => arr.indexOf(name) !== index
        );

        if (!isEmpty(duplicate)) {
          setGeneralError(
            new Error(
              `Entity name must be unique. Duplicate names found - ${duplicate.join(
                ", "
              )} `
            )
          );
          return;
        }
      }

      trackEvent({
        eventName: "createAppFromFile",
        appName: data.app.name,
      });
      createAppWithEntities({ variables: { data } }).catch(console.error);
    },
    [createAppWithEntities, trackEvent]
  );

  const errorMessage = formatError(error) || formatError(generalError);

  const handleStartFromSample = useCallback(() => {
    trackEvent({
      eventName: "createAppFromSample",
    });
    createAppWithEntities({ variables: { data: sampleAppWithEntities } }).catch(
      console.error
    );
  }, [createAppWithEntities, trackEvent]);

  const handleStartFromScratch = useCallback(() => {
    trackEvent({
      eventName: "createAppFromScratch",
    });
    createAppWithEntities({
      variables: { data: sampleAppWithoutEntities },
    }).catch(console.error);
  }, [createAppWithEntities, trackEvent]);

  useEffect(() => {
    if (data) {
      const appId = data.createAppWithEntities.id;
      //const buildId = data.createAppWithEntities.builds[0].id;

      history.push(`/${appId}/entities`);
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
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__layout`}>
        {loading ? (
          <div className={`${CLASS_NAME}__processing`}>
            <div className={`${CLASS_NAME}__processing__title`}>
              All set! We’re currently generating your app.
            </div>
            <div className={`${CLASS_NAME}__processing__message`}>
              It should only take a few seconds to finish. Don't go away!
            </div>

            <SvgThemeImage image={EnumImages.Generating} />
            <div className={`${CLASS_NAME}__processing__loader`}>
              <ProgressBar />
            </div>
            <div className={`${CLASS_NAME}__processing__tagline`}>
              For a full experience, connect with a GitHub repository and get a
              new Pull Request every time you make changes in your data model.
            </div>
          </div>
        ) : isEmpty(fileName) ? (
          <div className={`${CLASS_NAME}__select-file`}>
            {appsExist && (
              <Link to="/" className={`${CLASS_NAME}__back`}>
                <Icon icon="arrow_left" />
                Back
              </Link>
            )}
            <div className={`${CLASS_NAME}__header`}>
              <SvgThemeImage image={EnumImages.ImportExcel} />
              <h2>Start with schema from excel</h2>
              <div className={`${CLASS_NAME}__message`}>
                Start building your application from an existing schema. Just
                upload an excel or CSV file to import its schema, and generate
                your node.JS application source code
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
            <div className={`${CLASS_NAME}__divider`}>or</div>
            <div className={`${CLASS_NAME}__other-options`}>
              <Link
                onClick={handleStartFromScratch}
                className={`${CLASS_NAME}__other-options__option`}
              >
                <SvgThemeImage image={EnumImages.AddApp} />
                <div>Start From Scratch</div>
              </Link>
              <Link
                onClick={handleStartFromSample}
                className={`${CLASS_NAME}__other-options__option`}
              >
                <SvgThemeImage image={EnumImages.SampleApp} />
                <div>Start from a sample app</div>
              </Link>
            </div>
          </div>
        ) : (
          <CreateAppFromExcelForm
            fileName={fileName}
            loading={loading}
            onClearForm={clearSelectedFile}
            onSubmit={handleSubmit}
            initialValues={initialValues}
          />
        )}
        <Snackbar
          open={Boolean(error) || Boolean(generalError)}
          message={errorMessage}
          onClose={clearGeneralError}
        />
      </div>
    </div>
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
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
      }
    }
  }
`;
