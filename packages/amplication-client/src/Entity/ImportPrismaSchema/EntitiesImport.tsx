import React, { useCallback, useMemo } from "react";
import { gql, useMutation } from "@apollo/client";
import { match } from "react-router-dom";
import PageContent from "../../Layout/PageContent";

import { FileUploader } from "../../Components/FileUploader";
import { AppRouteProps } from "../../routes/routesUtil";
import "./EntitiesImport.scss";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import { Snackbar } from "@amplication/ui/design-system";
import { useTracking } from "../../util/analytics";
import { formatError } from "../../util/error";
import * as models from "../../models";
import { isEmpty } from "lodash";
import ProgressBar from "../../Components/ProgressBar";
import ActionLog from "../../VersionControl/ActionLog";

const ACTION_LOG: models.Action = {
  id: "1",
  createdAt: new Date().toISOString(),
};

const ACTION_LOG_STEP: models.ActionStep = {
  id: "1",
  name: "PROCESSING",
  message: "Processing Prisma schema file",
  status: models.EnumActionStepStatus.Running,
  createdAt: new Date().toISOString(),
  logs: [],
};

const ACTION_LOG_STEP_START: models.ActionLog = {
  id: "1",
  message: "Importing Prisma schema file",
  level: models.EnumActionLogLevel.Info,
  createdAt: new Date().toISOString(),
  meta: {},
};

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
  }>;
};

type TData = {
  createEntitiesFromPrismaSchema: models.CreateEntitiesFromPrismaSchemaResponse;
};

const MAX_FILES = 1;
const ACCEPTED_FILE_TYPES = {
  "text/plain": [".prisma"],
};
const PAGE_TITLE = "Entities Import";

const CLASS_NAME = "entities-import";

const EntitiesImport: React.FC<Props> = ({ match, innerRoutes }) => {
  const { resource: resourceId } = match.params;
  const { trackEvent } = useTracking();

  const [fileName, setFileName] = React.useState<string | null>(null);

  const [createEntitiesFormSchema, { data, error, loading }] =
    useMutation<TData>(CREATE_ENTITIES_FORM_SCHEMA);

  const actionLog: models.Action = useMemo(() => {
    if (!data?.createEntitiesFromPrismaSchema) {
      return {
        ...ACTION_LOG,
        steps: [
          {
            ...ACTION_LOG_STEP,
            logs: [ACTION_LOG_STEP_START],
          },
        ],
      };
    }

    return {
      ...ACTION_LOG,
      steps: [
        {
          ...ACTION_LOG_STEP,
          completedAt: new Date().toISOString(),
          status: models.EnumActionStepStatus.Success,
          logs: [
            ACTION_LOG_STEP_START,
            ...data.createEntitiesFromPrismaSchema.log,
          ],
        },
      ],
    };
  }, [data, loading]);

  const clearSelectedFile = useCallback(() => {
    setFileName(null);
  }, [setFileName]);

  const errorMessage = formatError(error);

  const onFilesSelected = useCallback(
    (selectedFiles: File[]) => {
      // trackEvent({
      //   eventName: "importPrismaSchema",
      // });
      setFileName(selectedFiles[0].name);

      // const reader = new FileReader();
      // reader.onload = () => {
      //   setFileName(selectedFiles[0].name);
      // };

      // read file contents
      //selectedFiles.forEach((file) => reader.readAsBinaryString(file));

      const currentTime = new Date().toISOString();

      ACTION_LOG.createdAt = currentTime;
      ACTION_LOG_STEP.createdAt = currentTime;
      ACTION_LOG_STEP_START.createdAt = currentTime;

      createEntitiesFormSchema({
        variables: {
          data: {
            resourceId,
          },
          file: selectedFiles[0],
        },
        context: {
          hasUpload: true,
        },
      });
    },
    [createEntitiesFormSchema, resourceId]
  );

  return (
    <PageContent className={CLASS_NAME} pageTitle={PAGE_TITLE}>
      <>
        <div className={`${CLASS_NAME}__header`}>
          <SvgThemeImage image={EnumImages.ImportExcel} />
          <h2>Import Prisma schema file</h2>
          <div className={`${CLASS_NAME}__message`}>
            upload a Prisma schema file to import its content, and create
            entities and relations
          </div>
        </div>
        <div className={`${CLASS_NAME}__content`}>
          {loading || (data && data.createEntitiesFromPrismaSchema) ? (
            <>
              <ActionLog
                action={actionLog}
                title="Import Schema"
                versionNumber=""
              />

              {/* <div>Entities</div>
              {data.createEntitiesFromPrismaSchema.entities?.map((entity) => (
                <div>{entity.name}</div>
              ))} */}
            </>
          ) : isEmpty(fileName) ? (
            <>
              <FileUploader
                onFilesSelected={onFilesSelected}
                maxFiles={MAX_FILES}
                acceptedFileTypes={ACCEPTED_FILE_TYPES}
              />
            </>
          ) : (
            <>
              <ProgressBar />

              <div>file selected {fileName}</div>
              {/* <Button onClick={clearSelectedFile}>clear</Button> */}
            </>
          )}
        </div>
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </>
    </PageContent>
  );

  /**@todo: move error message to hosting page  */
};

export default EntitiesImport;

const CREATE_ENTITIES_FORM_SCHEMA = gql`
  mutation createEntitiesFromPrismaSchema(
    $data: CreateEntitiesFromPrismaSchemaInput!
    $file: Upload!
  ) {
    createEntitiesFromPrismaSchema(data: $data, file: $file) {
      entities {
        name
        displayName
        pluralDisplayName
        description
        fields {
          name
          displayName
          dataType
        }
      }
      log {
        message
        level
        createdAt
      }
    }
  }
`;
