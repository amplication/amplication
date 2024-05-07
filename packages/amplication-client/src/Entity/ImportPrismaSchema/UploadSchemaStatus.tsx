import { ImportSchemaSuccess } from "./ImportSchemaSuccess";
import { EnumUserActionStatus, UserAction } from "../../models";
import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import "./UploadSchemaStatus.scss";

const CLASS_NAME = "upload-schema-state";

enum EnumUploadSchemaState {
  Initial = "Initial",
  InProgress = "InProgress",
  Success = "Success",
  Failure = "Failure",
}

type UploadSchemaStatusMap = {
  title: string;
  message: string;
  showLogMessage?: boolean;
};

const uploadSchemaStateMap: Record<
  EnumUploadSchemaState,
  UploadSchemaStatusMap
> = {
  Initial: {
    title: "Import Prisma schema file",
    message:
      "upload a Prisma schema file to import its content, and create entities and relations. Only '*.prisma' files are supported.",
    showLogMessage: false,
  },
  InProgress: {
    title: "Hold on!",
    message: "We're adding a touch of magic to your DB schema upload...",
    showLogMessage: false,
  },
  Success: {
    title: "Schema import completed successfully!",
    message: "Ready to take the next step? Choose your action.",
    showLogMessage: false,
  },
  Failure: {
    title: "Oops! Schema import failed",
    message: "",
    showLogMessage: true,
  },
};

const mapUserActionStatusToUploadSchemaStatus = (
  userActionStatus: EnumUserActionStatus
) => {
  switch (userActionStatus) {
    case EnumUserActionStatus.Running:
      return EnumUploadSchemaState.InProgress;
    case EnumUserActionStatus.Completed:
      return EnumUploadSchemaState.Success;
    case EnumUserActionStatus.Failed:
      return EnumUploadSchemaState.Failure;
    default:
      return EnumUploadSchemaState.Initial;
  }
};

type UploadSchemaStatusProps = {
  userAction: UserAction;
  logMessage: string;
};

export const UploadSchemaStatus = ({
  userAction,
  logMessage,
}: UploadSchemaStatusProps) => {
  const status = mapUserActionStatusToUploadSchemaStatus(userAction?.status);
  const { title, message, showLogMessage } = uploadSchemaStateMap[status];

  return (
    <FlexItem
      className={CLASS_NAME}
      direction={EnumFlexDirection.Column}
      gap={EnumGapSize.Large}
      itemsAlign={EnumItemsAlign.Center}
      margin={EnumFlexItemMargin.Bottom}
    >
      {status === EnumUploadSchemaState.Initial && (
        <SvgThemeImage image={EnumImages.ImportPrismaSchema} />
      )}
      <Text textStyle={EnumTextStyle.H2} className={`${CLASS_NAME}__title`}>
        {title}
      </Text>
      <Text
        textColor={
          showLogMessage ? EnumTextColor.ThemeRed : EnumTextColor.Black20
        }
        className={`${CLASS_NAME}__message`}
      >
        {showLogMessage ? logMessage : message}
      </Text>
      {status === EnumUploadSchemaState.Success && <ImportSchemaSuccess />}
    </FlexItem>
  );
};
