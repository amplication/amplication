import React, { useCallback, useEffect, useMemo, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useHistory, Link } from "react-router-dom";
import classNames from "classnames";
import { forEach, isEmpty } from "lodash";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import {
  COMMON_FIELDS,
  EntitiesDiagramFormData,
} from "../EntitiesDiagram/EntitiesDiagram";
import {
  Snackbar,
  Icon,
  CSSTransition,
  SwitchTransition,
} from "@amplication/design-system";
import * as models from "../models";
import { useTracking } from "../util/analytics";
import { formatError } from "../util/error";
import { GET_RESOURCES } from "../Workspaces/ResourceList";
import "./CreateResourceFromExcel.scss";
import { CreateResourceFromExcelForm } from "./CreateResourceFromExcelForm";
import {
  sampleServiceResourceWithEntities,
  sampleServiceResourceWithoutEntities,
} from "./constants";
import ProgressBar from "../Components/ProgressBar";

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
  createResourceWithEntities: models.Resource;
};

enum Steps {
  startScreen,
  startWithExcel,
}

export const CLASS_NAME = "create-resource-from-excel";
const MAX_SAMPLE_DATA = 3;

export function CreateResourceFromExcel() {
  const [importList, setImportList] = useState<ImportField[]>([]);
  const [step, setStep] = useState<Steps>(Steps.startScreen);
  const [fileName, setFileName] = useState<string | null>(null);
  const { data: resourcesData } = useQuery<{
    resources: Array<models.Resource>;
  }>(GET_RESOURCES);
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
          resourceName: fileName,
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

  const resourcesExist = useMemo(() => {
    return resourcesData && !isEmpty(resourcesData.resources);
  }, [resourcesData]);

  const [createResourceWithEntities, { loading, data, error }] = useMutation<
    TData
  >(CREATE_RESOURCE_WITH_ENTITIES, {
    update(cache, { data }) {
      if (!data) return;
      const queryData = cache.readQuery<{ resources: Array<models.Resource> }>({
        query: GET_RESOURCES,
      });
      if (queryData === null) {
        return;
      }
      cache.writeQuery({
        query: GET_RESOURCES,
        data: {
          resources: queryData.resources.concat([
            data.createResourceWithEntities,
          ]),
        },
      });
    },
  });

  const clearSelectedFile = useCallback(() => {
    setFileName(null);
  }, [setFileName]);

  const initialValues = useMemo((): EntitiesDiagramFormData => {
    const fileNameWithoutExtension = fileName?.replace(/\.[^/.]+$/, "");

    const data: EntitiesDiagramFormData = {
      resource: {
        name: fileNameWithoutExtension || "",
        description: fileNameWithoutExtension || "",
        resourceType: models.EnumResourceType.Service,
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
        eventName: "createResourceFromFile",
        resourceName: data.resource.name,
      });
      createResourceWithEntities({ variables: { data } }).catch(console.error);
    },
    [createResourceWithEntities, trackEvent]
  );

  const errorMessage = formatError(error) || formatError(generalError);

  const handleStartFromSample = useCallback(() => {
    trackEvent({
      eventName: "createResourceFromSample",
    });
    createResourceWithEntities({
      variables: { data: sampleServiceResourceWithEntities },
    }).catch(console.error);
  }, [createResourceWithEntities, trackEvent]);

  const handleStartFromScratch = useCallback(() => {
    trackEvent({
      eventName: "createResourceFromScratch",
    });
    createResourceWithEntities({
      variables: { data: sampleServiceResourceWithoutEntities },
    }).catch(console.error);
  }, [createResourceWithEntities, trackEvent]);

  useEffect(() => {
    if (data) {
      const resourceId = data.createResourceWithEntities.id;

      history.push(`/${resourceId}`);
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

  const dropExcel = () => (
    <div
      {...getRootProps()}
      className={classNames(`${CLASS_NAME}__dropzone`, {
        [`${CLASS_NAME}__dropzone--active`]: isDragActive,
      })}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <div className={`${CLASS_NAME}__dropzone__active_content`}>
          <p>Drop it like it's hot</p>
          <SvgThemeImage image={EnumImages.DropExcel} />
        </div>
      ) : (
        <>
          <SvgThemeImage image={EnumImages.ImportExcel} />
          <p>Drag and drop a file here, or click to select a file</p>
        </>
      )}
    </div>
  );

  const excelOption = () => (
    <div
      className={`${CLASS_NAME}__header ${CLASS_NAME}__excel_option`}
      onClick={() => setStep(Steps.startWithExcel)}
    >
      <SvgThemeImage image={EnumImages.ImportExcel} />
      <div className={`${CLASS_NAME}__message`}>
        Just upload an Excel or CSV file to import its schema and then generate
        your node.js resource source code.
      </div>
    </div>
  );

  const startWithExcel = () => (
    <>
      <div className={`${CLASS_NAME}__header`}>
        <h1 className={`${CLASS_NAME}__excel_start_title`}>
          Start with schema from excel
        </h1>
        <div className={`${CLASS_NAME}__message`}>
          Just upload an Excel or CSV file to import its schema and then
          generate your node.js resource source code.
        </div>
      </div>
      {dropExcel()}
    </>
  );

  const startFromScratch = () => (
    <div
      onClick={handleStartFromScratch}
      className={`${CLASS_NAME}__other-options__scratch_option`}
    >
      <div className={`${CLASS_NAME}__other-options__option_text`}>
        Start from
      </div>
      <div className={`${CLASS_NAME}__other-options__option_code_text`}>
        &lt;Scratch&gt;
      </div>
    </div>
  );

  const startFromSampleService = () => (
    <div
      onClick={handleStartFromSample}
      className={`${CLASS_NAME}__other-options__sample_option`}
    >
      <div className={`${CLASS_NAME}__other-options__option_text`}>
        Start from
      </div>
      <div className={`${CLASS_NAME}__other-options__option_code_text`}>
        &lt;Sample Service&gt;
      </div>
    </div>
  );

  const getBackButton = () => {
    if (step === Steps.startWithExcel) {
      return (
        <div
          className={`${CLASS_NAME}__back`}
          onClick={() => setStep(Steps.startScreen)}
        >
          <Icon icon="arrow_left" />
          Back
        </div>
      );
    }
    if (resourcesExist) {
      return (
        <Link to="/" className={`${CLASS_NAME}__back`}>
          <Icon icon="arrow_left" />
          Back
        </Link>
      );
    }
  };

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__layout`}>
        {loading ? (
          <div className={`${CLASS_NAME}__processing`}>
            <div className={`${CLASS_NAME}__processing__title`}>
              All set! We’re currently generating your service.
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
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={step}
              timeout={500}
              classNames={`${CLASS_NAME}__options_screen_fade`}
            >
              <div className={`${CLASS_NAME}__option_container`}>
                {getBackButton()}

                <div className={`${CLASS_NAME}__option_content`}>
                  {step === Steps.startScreen ? (
                    <>
                      <h1 className={`${CLASS_NAME}__welcome_text`}>
                        Welcome to Amplication
                      </h1>
                      <h2 className={`${CLASS_NAME}__start_text`}>
                        Let's start building your resource
                      </h2>

                      <div className={`${CLASS_NAME}__other-options`}>
                        {startFromScratch()}
                        {startFromSampleService()}
                      </div>
                      <div className={`${CLASS_NAME}__divider`}>
                        <span>or</span>
                      </div>
                      {excelOption()}
                    </>
                  ) : (
                    startWithExcel()
                  )}
                </div>
              </div>
            </CSSTransition>
          </SwitchTransition>
        ) : (
          <CreateResourceFromExcelForm
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

const CREATE_RESOURCE_WITH_ENTITIES = gql`
  mutation createResourceWithEntities($data: ResourceCreateWithEntitiesInput!) {
    createResourceWithEntities(data: $data) {
      id
      name
      description
      builds(orderBy: { createdAt: Desc }, take: 1) {
        id
      }
    }
  }
`;

export default CreateResourceFromExcel;
