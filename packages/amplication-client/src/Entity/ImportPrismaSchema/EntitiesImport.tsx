import { useMutation } from "@apollo/client";
import React, { useCallback, useMemo } from "react";
import { match } from "react-router-dom";
import PageContent from "../../Layout/PageContent";

import {
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { FileUploader } from "../../Components/FileUploader";
import ActionLog from "../../VersionControl/ActionLog";
import * as models from "../../models";
import { AppRouteProps } from "../../routes/routesUtil";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { formatError } from "../../util/error";
import { CREATE_ENTITIES_FROM_SCHEMA } from "./queries";
import { UploadSchemaStatus } from "./UploadSchemaStatus";
import "./EntitiesImport.scss";
import useUserActionWatchStatus from "../../UserAction/useUserActionWatchStatus";

const PROCESSING_PRISMA_SCHEMA = "PROCESSING_PRISMA_SCHEMA";

const ACTION_LOG: models.Action = {
  id: "1",
  createdAt: new Date().toISOString(),
};

const ACTION_LOG_STEP: models.ActionStep = {
  id: "1",
  name: PROCESSING_PRISMA_SCHEMA,
  message: "Import Prisma schema file",
  status: models.EnumActionStepStatus.Running,
  createdAt: new Date().toISOString(),
  logs: [],
};

const ACTION_LOG_STEP_START: models.ActionLog = {
  id: "1",
  message: "Processing Prisma schema file",
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
  createEntitiesFromPrismaSchema: models.UserAction;
};

const MAX_FILES = 1;
const ACCEPTED_FILE_TYPES = {
  "text/plain": [".prisma"],
};
const PAGE_TITLE = "Entities Import";

const CLASS_NAME = "entities-import";

const EntitiesImport: React.FC<Props> = ({ match, innerRoutes }) => {
  const [userAction, setUserAction] = React.useState<models.UserAction>(null);
  const { data: userActionData } = useUserActionWatchStatus(userAction);

  const { resource: resourceId } = match.params;
  const { trackEvent } = useTracking();

  const [createEntitiesFormSchema, { data, error, loading }] =
    useMutation<TData>(CREATE_ENTITIES_FROM_SCHEMA, {
      onCompleted: (data) => {
        setUserAction(data.createEntitiesFromPrismaSchema);
      },
    });

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
      ...data.createEntitiesFromPrismaSchema.action,
      ...userActionData?.userAction?.action,
    };
  }, [data, loading, userActionData]);

  const importErrorMessage = useMemo(() => {
    const errorLevelLogs = actionLog.steps[0]?.logs.filter(
      (log) => log.level === models.EnumActionLogLevel.Error
    );

    const lastErrorLog = errorLevelLogs[errorLevelLogs.length - 1];

    return lastErrorLog?.message;
  }, [actionLog.steps]);

  const errorMessage = formatError(error);

  const onFilesSelected = useCallback(
    (selectedFiles: File[]) => {
      const file = selectedFiles[0];

      trackEvent({
        eventName: AnalyticsEventNames.ImportPrismaSchemaSelectFile,
        fileName: file.name,
      });

      createEntitiesFormSchema({
        variables: {
          data: {
            userActionType: models.EnumUserActionType.DbSchemaImport,
            resource: {
              connect: {
                id: resourceId,
              },
            },
          },
          file,
        },
        context: {
          hasUpload: true,
        },
      }).catch(console.error);
    },
    [createEntitiesFormSchema, resourceId]
  );

  return (
    <PageContent className={CLASS_NAME} pageTitle={PAGE_TITLE}>
      <FlexItem
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Stretch}
      >
        <UploadSchemaStatus
          userAction={userActionData?.userAction}
          logMessage={importErrorMessage}
        />
        <div>
          {loading || (data && data.createEntitiesFromPrismaSchema) ? (
            <>
              <ActionLog
                height={"40vh"}
                action={actionLog}
                title="Import Schema"
                versionNumber=""
              />
            </>
          ) : (
            <>
              <FileUploader
                onFilesSelected={onFilesSelected}
                maxFiles={MAX_FILES}
                acceptedFileTypes={ACCEPTED_FILE_TYPES}
              />
            </>
          )}
        </div>

        <Text
          textStyle={EnumTextStyle.Label}
          className={`${CLASS_NAME}__link-docs`}
        >
          Need more guidance? Explore our
          <a
            href="https://docs.amplication.com/how-to/import-prisma-schema/"
            target="_blank"
            rel="noreferrer"
          >
            &nbsp;documentation
          </a>
          &nbsp;on importing Prisma schema files
        </Text>
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </FlexItem>
    </PageContent>
  );
};

export default EntitiesImport;
