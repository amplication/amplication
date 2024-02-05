import { useMutation } from "@apollo/client";
import React, { useCallback, useMemo } from "react";
import { match } from "react-router-dom";
import PageContent from "../../Layout/PageContent";

import { Snackbar } from "@amplication/ui/design-system";
import { FileUploader } from "../../Components/FileUploader";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import ActionLog from "../../VersionControl/ActionLog";
import * as models from "../../models";
import { AppRouteProps } from "../../routes/routesUtil";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { formatError } from "../../util/error";
import "./EntitiesImport.scss";
import { CREATE_ENTITIES_FROM_SCHEMA } from "./queries";
import useUserActionWatchStatus from "../../UserAction/useUserActionWatchStatus";
import { BillingFeature } from "@amplication/util-billing-types";
import { useStiggContext } from "@stigg/react-sdk";
import { Button } from "../../Components/Button";

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

  const { stigg } = useStiggContext();

  const canImportDBSchema = stigg.getBooleanEntitlement({
    featureId: BillingFeature.ImportDBSchema,
  }).hasAccess;

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
      <>
        {!canImportDBSchema ? (
          <div className={`${CLASS_NAME}__beta-wrapper`}>
            <div className={`${CLASS_NAME}__beta-wrapper__header`}>
              <SvgThemeImage image={EnumImages.ImportPrisma} />
              <h2>Modernize Faster with Amplication DB Schema Import</h2>
              <div className={`${CLASS_NAME}__beta-wrapper__feature `}>
                Seamlessly import your existing database schema directly into
                Amplication. <br /> Ideal for modernization initiatives,
                significantly reduces transition time by preserving your
                underlying database while you rebuild and enhance your systems.
              </div>
              <div className={`${CLASS_NAME}__beta-wrapper__feature `}>
                Want to get early access and help shape the future of our
                platform?
              </div>
              <a
                target="db-import-beta"
                href="https://amplication.com/db-import-beta"
              >
                <Button
                  eventData={{
                    eventName:
                      AnalyticsEventNames.ImportPrismaSchemaJoinBetaClick,
                  }}
                >
                  Join our beta group now
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className={`${CLASS_NAME}__header`}>
              <SvgThemeImage image={EnumImages.ImportPrismaSchema} />
              <h2>Import Prisma schema file</h2>
              <div className={`${CLASS_NAME}__message`}>
                upload a Prisma schema file to import its content, and create
                entities and relations.
                <br />
                Only '*.prisma' files are supported.
              </div>
            </div>

            <div className={`${CLASS_NAME}__content`}>
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
          </>
        )}
        <div className={`${CLASS_NAME}__header`}>
          <p className={`${CLASS_NAME}__link-button`}>
            Need more guidance? Explore our
            <a
              href="https://docs.amplication.com/how-to/import-prisma-schema/"
              target="_blank"
              rel="noreferrer"
            >
              &nbsp;documentation
            </a>
            &nbsp;on importing Prisma schema files
          </p>
        </div>
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </>
    </PageContent>
  );
};

export default EntitiesImport;
