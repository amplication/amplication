import React from "react";
import { Panel, EnumPanelStyle, Icon } from "@amplication/ui/design-system";
import "./OverviewTile.scss";
import { useQuery } from "@apollo/client";
import { ServiceSettings, EnumAuthProviderType } from "../../models";
import { GET_RESOURCE_SETTINGS } from "../resourceSettings/GenerationSettingsForm";

type Props = {
  resourceId: string;
};

const AuthProviderLabels: { [k in EnumAuthProviderType]: string } = {
  [EnumAuthProviderType.Http]: "HTTP",
  [EnumAuthProviderType.Jwt]: "Passport JWT",
};

export enum EnumDbType {
  mongo = "mongo",
  postgres = "postgres",
  mysql = "mysql",
}

const DbTypeLabels: { [k in EnumDbType]: string } = {
  [EnumDbType.mongo]: "MongoDB",
  [EnumDbType.mysql]: "MySQL",
  [EnumDbType.postgres]: "PostgresSQL",
};

const CLASS_NAME = "overview-tile";

const OverviewTile: React.FC<Props> = ({ resourceId }: Props) => {
  const { data } = useQuery<{
    serviceSettings: ServiceSettings;
  }>(GET_RESOURCE_SETTINGS, {
    variables: {
      id: resourceId,
    },
  });

  const dbType = DbTypeLabels[data?.serviceSettings.dbType];
  const generateGraphQL = data?.serviceSettings.serverSettings.generateGraphQL;
  const generateAdminUI = data?.serviceSettings.adminUISettings.generateAdminUI;
  const generateRestApi = data?.serviceSettings.serverSettings.generateRestApi;

  return (
    <Panel
      clickable={false}
      panelStyle={EnumPanelStyle.Bordered}
      className={CLASS_NAME}
    >
      <>
        <div className={`${CLASS_NAME}__header`}>
          <Icon icon="home" size="medium" />
          <h2 className={`${CLASS_NAME}__header__title`}>Overview</h2>
        </div>
        <div className={`${CLASS_NAME}__message`}>
          Your Amplication-generated resource is ready. We created it using
          amazing open-source technologies. Push the auto-generated code to
          GitHub and take it to the moon with your coding skills.
        </div>
        <div className={`${CLASS_NAME}__content`}>
          <div className={`${CLASS_NAME}__content__item`}>
            <div className={`${CLASS_NAME}__content__item__text`}>
              Node JS
              <span className={`${CLASS_NAME}__content__item__text--blue`}>
                {">"}16.0.0
              </span>
            </div>
            <div className={`${CLASS_NAME}__content__item__text`}>
              NestJS
              <span className={`${CLASS_NAME}__content__item__text--blue`}>
                8.2.3
              </span>
            </div>
            <div className={`${CLASS_NAME}__content__item__text`}>
              TypeScript
            </div>
          </div>
          <div className={`${CLASS_NAME}__content__item`}>
            {generateGraphQL ? (
              <div className={`${CLASS_NAME}__content__item__text`}>
                GraphQL
              </div>
            ) : null}
            {generateRestApi ? (
              <div className={`${CLASS_NAME}__content__item__text`}>
                REST API
              </div>
            ) : null}
            {generateAdminUI ? (
              <div className={`${CLASS_NAME}__content__item__text`}>
                Admin UI
              </div>
            ) : null}
          </div>
          <div className={`${CLASS_NAME}__content__item`}>
            <div className={`${CLASS_NAME}__content__item__text`}>
              Prisma
              <span className={`${CLASS_NAME}__content__item__text--blue`}>
                3.6.0
              </span>
            </div>
            <div className={`${CLASS_NAME}__content__item__text`}>
              {dbType || "PostgresSQL"}
            </div>
            <div className={`${CLASS_NAME}__content__item__text`}>Docker</div>
          </div>
          <div className={`${CLASS_NAME}__content__item`}>
            <div className={`${CLASS_NAME}__content__item__text`}>
              Authentication
              <span className={`${CLASS_NAME}__content__item__text--blue`}>
                {
                  AuthProviderLabels[
                    data?.serviceSettings.authProvider ||
                      EnumAuthProviderType.Jwt
                  ]
                }
              </span>
            </div>
            <div className={`${CLASS_NAME}__content__item__text`}>Jest</div>
          </div>
        </div>
      </>
    </Panel>
  );
};

export default OverviewTile;
