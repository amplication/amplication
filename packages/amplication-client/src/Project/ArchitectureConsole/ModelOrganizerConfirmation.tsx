import "./ModelOrganizerConfirmation.scss";
import { Button, EnumButtonStyle } from "../../Components/Button";
import {
  CircleBadge,
  EnumTextWeight,
  Text,
  Toggle,
} from "@amplication/ui/design-system";
import { ModelChanges } from "./types";
import TempServiceView from "./TempServiceView";
import adminUI from "../../assets/images/admin-ui.svg";
import graphql from "../../assets/images/graphql.svg";
import swagger from "../../assets/images/swagger.svg";
import { PLUGIN_LOGO_BASE_URL } from "../../Resource/create-resource/CreateServiceWizard";
import ImgSvg from "../../Resource/create-resource/wizard-pages/ImgSvg";
export const CLASS_NAME = "model-organizer-confirmation";

type Props = {
  onConfirmChanges: () => void;
  onCancelChanges: () => void;
  changes: ModelChanges;
};

export default function ModelOrganizerConfirmation({
  onConfirmChanges,
  onCancelChanges,
  changes,
}: Props) {
  const PostgresPng = ImgSvg({
    image: `${PLUGIN_LOGO_BASE_URL}db-postgres.png`,
    imgSize: "large",
  });
  const MongoPng = ImgSvg({
    image: `${PLUGIN_LOGO_BASE_URL}db-mongo.png`,
    imgSize: "large",
  });
  const MysqlPng = ImgSvg({
    image: `${PLUGIN_LOGO_BASE_URL}db-mysql.png`,
    imgSize: "large",
  });
  const MsSqlPng = ImgSvg({
    image: `${PLUGIN_LOGO_BASE_URL}db-mssql.png`,
    imgSize: "large",
  });

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__information`}>
        {" "}
        <Text textWeight={EnumTextWeight.Regular}>
          <a
            className={`${CLASS_NAME}__documentation`}
            href={"https://docs.amplication.com"}
            target="blank"
          >
            <Text>{"Check our documentation"}</Text>{" "}
          </a>
          <span>
            {" "}
            to understand how relations between entities are resolved as part of
            this migration process{" "}
          </span>
        </Text>
        <span>
          In case of existing database, data migration may be required
        </span>
      </div>
      {changes?.newServices?.length > 0 && (
        <>
          <Text textWeight={EnumTextWeight.Bold}>
            {"This is the services will be created"}
          </Text>
          <div className={`${CLASS_NAME}__newServiceList`}>
            {changes.newServices.map((service) => (
              <TempServiceView
                newService={service}
                movedEntities={changes.movedEntities.filter(
                  (e) => e.targetResourceId === service.tempId
                )}
              ></TempServiceView>
            ))}
          </div>
        </>
      )}
      <Text textWeight={EnumTextWeight.Bold}>{"The services properties"}</Text>
      <Text textWeight={EnumTextWeight.Bold}>
        {"Select APIs & Admin UI Options"}
      </Text>
      <div className={`${CLASS_NAME}__api_options`}>
        <div
          style={{ background: "#2C3249" }}
          className={`${CLASS_NAME}__api_item`}
        >
          <img src={graphql} alt="" />
          <span>GraphQL API</span>
        </div>
        <div className={`${CLASS_NAME}__api_item`}>
          <img src={swagger} alt="" />
          <span>REST API & Swagger UI</span>
        </div>
        <div className={`${CLASS_NAME}__api_item`}>
          <img src={adminUI} alt="" />
          <span>Admin UI</span>
        </div>
      </div>
      <Text textWeight={EnumTextWeight.Bold}>
        {"Are you using a monorepo or polyrepo?"}
      </Text>
      <div className={`${CLASS_NAME}__api_options`}>
        <div
          style={{ background: "#2C3249" }}
          className={`${CLASS_NAME}__api_item`}
        >
          <span>Monorepo</span>
        </div>
        <div className={`${CLASS_NAME}__api_item`}>
          <span>Polyrepo</span>
        </div>
      </div>
      <Text textWeight={EnumTextWeight.Bold}>
        {"Which database do you want to use?"}
      </Text>
      <div className={`${CLASS_NAME}__api_options`}>
        <div
          style={{ background: "#2C3249" }}
          className={`${CLASS_NAME}__api_item`}
        >
          <CircleBadge color="#22273C" border="1px solid #373D57" size="small">
            {PostgresPng}
          </CircleBadge>
          <span>PostgreSQL</span>
        </div>
        <div className={`${CLASS_NAME}__api_item`}>
          <CircleBadge color="#22273C" border="1px solid #373D57" size="small">
            {MongoPng}
          </CircleBadge>
          <span>MongoDB</span>
        </div>
        <div className={`${CLASS_NAME}__api_item`}>
          <CircleBadge color="#22273C" border="1px solid #373D57" size="small">
            {MysqlPng}
          </CircleBadge>
          <span>MySQL</span>
        </div>
        <div className={`${CLASS_NAME}__api_item`}>
          <CircleBadge color="#22273C" border="1px solid #373D57" size="small">
            {MsSqlPng}
          </CircleBadge>
          <span>MS SQL Server</span>
        </div>
      </div>
      <div className={`${CLASS_NAME}__api_options`}>
        <Toggle checked={false} disabled />
        <Text textWeight={EnumTextWeight.Regular}>{"Use Auth module"}</Text>
      </div>
      <div className={`${CLASS_NAME}__note`}>
        <span style={{ color: "#53DBEE" }}>Note:</span>
        <span>
          All parameters can be updated later on for each service separately.
        </span>
      </div>
      <div className={`${CLASS_NAME}__Buttons`}>
        <Button buttonStyle={EnumButtonStyle.Outline} onClick={onCancelChanges}>
          Cancel
        </Button>
        <Button onClick={onConfirmChanges}>Apply</Button>
      </div>
    </div>
  );
}
