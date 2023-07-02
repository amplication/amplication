import React from "react";
import { Panel, EnumPanelStyle, Icon } from "@amplication/ui/design-system";
import "./OverviewTile.scss";
import { gql, useQuery } from "@apollo/client";
import { ServiceSettings, EnumAuthProviderType, Resource } from "../../models";
import { GET_RESOURCE_SETTINGS } from "../resourceSettings/GenerationSettingsForm";

type Props = {
  resourceId: string;
};

const AuthProviderLabels: { [k in EnumAuthProviderType]: string } = {
  [EnumAuthProviderType.Http]: "HTTP",
  [EnumAuthProviderType.Jwt]: "Passport JWT",
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

  const { data: resourceGitRepository } = useQuery<{
    resource: Resource;
  }>(GET_RESOURCE_GIT_REPOSITORY_CONNECTED_GIT_PROVIDER, {
    variables: {
      resourceId,
    },
  });

  // get the connected git provider from the resource git repository, and if the resource is still not connected to any git provider, use a fallback
  const connectedGitProvider =
    resourceGitRepository?.resource.gitRepository?.gitOrganization.provider ||
    `git provider`;

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
          amazing open-source technologies. Push the auto-generated code to{" "}
          {connectedGitProvider} and take it to the moon with your coding
          skills.
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

const GET_RESOURCE_GIT_REPOSITORY_CONNECTED_GIT_PROVIDER = gql`
  query getResourceGitRepository($resourceId: String!) {
    resource(where: { id: $resourceId }) {
      gitRepository {
        gitOrganization {
          provider
        }
      }
    }
  }
`;
