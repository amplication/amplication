import React from "react";
import { Panel, EnumPanelStyle, Icon } from "@amplication/design-system";
import "./OverviewTile.scss";
import { useQuery } from "@apollo/client";
import { GET_APP_SETTINGS } from "../ApplicationAuthSettingForm";
import { AppSettings, EnumAuthProviderType } from "../../models";

type Props = {
  applicationId: string;
};

const AuthProviderLabels: { [k in EnumAuthProviderType]: string } = {
  [EnumAuthProviderType.Http]: "HTTP",
  [EnumAuthProviderType.Jwt]: "Passport JWT",
};

const CLASS_NAME = "overview-tile";

const OverviewTile: React.FC<Props> = ({ applicationId }: Props) => {
  const { data } = useQuery<{
    appSettings: AppSettings;
  }>(GET_APP_SETTINGS, {
    variables: {
      id: applicationId,
    },
  });

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
          Your Amplication-generated app is ready. We created it using the
          amazing open-source technologies. Push the auto-generated code to
          GitHub or download the source-code and take it to the moon with your
          coding skills.
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
              Next JS
              <span className={`${CLASS_NAME}__content__item__text--blue`}>
                8.2.3
              </span>
            </div>
            <div className={`${CLASS_NAME}__content__item__text`}>
              TypeScript
            </div>
          </div>
          <div className={`${CLASS_NAME}__content__item`}>
            <div className={`${CLASS_NAME}__content__item__text`}>GraphQL</div>
            <div className={`${CLASS_NAME}__content__item__text`}>REST API</div>
            <div className={`${CLASS_NAME}__content__item__text`}>Admin UI</div>
          </div>
          <div className={`${CLASS_NAME}__content__item`}>
            <div className={`${CLASS_NAME}__content__item__text`}>
              Prisma
              <span className={`${CLASS_NAME}__content__item__text--blue`}>
                3.6.0
              </span>
            </div>
            <div className={`${CLASS_NAME}__content__item__text`}>
              PostgresSQL
            </div>
            <div className={`${CLASS_NAME}__content__item__text`}>Docker</div>
          </div>
          <div className={`${CLASS_NAME}__content__item`}>
            <div className={`${CLASS_NAME}__content__item__text`}>
              Authentication
              <span className={`${CLASS_NAME}__content__item__text--blue`}>
                {AuthProviderLabels[data?.appSettings.authProvider]}
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
