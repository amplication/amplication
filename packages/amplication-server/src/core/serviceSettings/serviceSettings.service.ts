import { Injectable, Inject } from "@nestjs/common";
import { ServiceSettings, UpdateServiceSettingsArgs } from "./dto";
import { FindOneArgs } from "../../dto";
import { BlockService } from "../block/block.service";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { DEFAULT_SERVICE_SETTINGS, ServiceSettingsValues } from "./constants";
import { User } from "../../models";
import { EnumAuthProviderType } from "./dto/EnumAuthenticationProviderType";
import { ServiceSettingsUpdateInput } from "./dto/ServiceSettingsUpdateInput";
import { merge } from "lodash";

export const isStringBool = (val: string | boolean): boolean =>
  typeof val === "boolean" || typeof val === "string";

@Injectable()
export class ServiceSettingsService {
  @Inject()
  private readonly blockService: BlockService;

  async getServiceSettingsValues(
    args: FindOneArgs,
    user: User
  ): Promise<ServiceSettingsValues> {
    const {
      serviceTemplateVersion,
      authProvider,
      serverSettings,
      adminUISettings,
      authEntityName,
    } = await this.getServiceSettingsBlock(args, user);

    return {
      resourceId: args.where.id,
      authProvider,
      serverSettings,
      adminUISettings,
      authEntityName,
      serviceTemplateVersion,
    };
  }

  async getServiceSettingsBlock(
    args: FindOneArgs,
    user: User
  ): Promise<ServiceSettings> {
    let [serviceSettings] =
      await this.blockService.findManyByBlockType<ServiceSettings>(
        {
          where: {
            resource: {
              id: args.where.id,
            },
          },
        },
        EnumBlockType.ServiceSettings
      );

    if (!serviceSettings) {
      // create default service settings will also set the server settings > generateServer to true
      serviceSettings = await this.createDefaultServiceSettings(
        args.where.id,
        user
      );
    }

    // set the service settings > server settings > generateServer to true by default, as we don't have a UI for it so the client can't set it
    serviceSettings.serverSettings.generateServer = true;

    return {
      ...serviceSettings,
      authProvider: serviceSettings.authProvider || EnumAuthProviderType.Jwt,
      ...(!serviceSettings.hasOwnProperty("serverSettings") ||
      !serviceSettings.hasOwnProperty("adminUISettings")
        ? this.updateServiceSettings(
            {
              data: {
                ...serviceSettings,
                serverSettings: {
                  generateGraphQL: true,
                  generateRestApi: true,
                  serverPath: "",
                },
                adminUISettings: {
                  generateAdminUI: true,
                  adminUIPath: "",
                },
              },
              where: {
                id: args.where.id,
              },
            },
            user
          )
        : {}),
    };
  }

  async updateServiceSettings(
    args: UpdateServiceSettingsArgs,
    user: User
  ): Promise<ServiceSettings> {
    const serviceSettingsBlock = await this.getServiceSettingsBlock(
      {
        where: { id: args.where.id },
      },
      user
    );

    return this.blockService.update<ServiceSettings>(
      {
        where: {
          id: serviceSettingsBlock.id,
        },
        data: {
          ...serviceSettingsBlock,
          ...args.data,
          adminUISettings: {
            adminUIPath: isStringBool(args.data?.adminUISettings?.adminUIPath)
              ? args.data?.adminUISettings?.adminUIPath
              : serviceSettingsBlock.adminUISettings.adminUIPath,
            generateAdminUI: isStringBool(
              args.data?.adminUISettings?.generateAdminUI
            )
              ? args.data?.adminUISettings?.generateAdminUI
              : serviceSettingsBlock.adminUISettings.generateAdminUI,
          },
          ...{
            serverSettings: {
              generateGraphQL: isStringBool(
                args.data?.serverSettings?.generateGraphQL
              )
                ? args.data?.serverSettings?.generateGraphQL
                : serviceSettingsBlock.serverSettings.generateGraphQL,
              generateRestApi: isStringBool(
                args.data?.serverSettings?.generateRestApi
              )
                ? args.data?.serverSettings?.generateRestApi
                : serviceSettingsBlock.serverSettings.generateRestApi,
              serverPath: isStringBool(args.data?.serverSettings?.serverPath)
                ? args.data?.serverSettings?.serverPath
                : serviceSettingsBlock.serverSettings.serverPath,
            },
          },
          ...(!args.data.serverSettings.generateGraphQL
            ? {
                adminUISettings: {
                  adminUIPath: isStringBool(
                    args.data?.adminUISettings?.adminUIPath
                  )
                    ? args.data?.adminUISettings?.adminUIPath
                    : serviceSettingsBlock.adminUISettings.adminUIPath,
                  generateAdminUI: false,
                },
              }
            : {}),
        },
      },
      user
    );
  }

  async updateServiceTemplateVersion(
    resourceId: string,
    newServiceTemplateVersion: string,
    user: User
  ) {
    const [serviceSettings] =
      await this.blockService.findManyByBlockType<ServiceSettings>(
        {
          where: {
            resource: {
              id: resourceId,
            },
          },
        },
        EnumBlockType.ServiceSettings
      );

    const templateSettings = serviceSettings.serviceTemplateVersion;

    templateSettings.version = newServiceTemplateVersion;

    return await this.blockService.update<ServiceSettings>(
      {
        where: {
          id: serviceSettings.id,
        },
        data: {
          displayName: serviceSettings.displayName,
          ...{
            serviceTemplateVersion: templateSettings,
          },
        },
      },
      user
    );
  }

  async createDefaultServiceSettings(
    resourceId: string,
    user: User,
    serviceSettings: ServiceSettingsUpdateInput = null
  ): Promise<ServiceSettings> {
    const defaultSettings = DEFAULT_SERVICE_SETTINGS;

    const mergedSettings = merge(defaultSettings, serviceSettings);

    return this.blockService.create<ServiceSettings>(
      {
        data: {
          resource: {
            connect: {
              id: resourceId,
            },
          },
          ...mergedSettings,
          blockType: EnumBlockType.ServiceSettings,
        },
      },
      user.id
    );
  }

  async getServiceIdsByTemplateId(
    projectId: string,
    templateId: string
  ): Promise<string[]> {
    const blocks = await this.blockService.findManyByBlockTypeAndSettings(
      {
        where: {
          resource: {
            deletedAt: null,
            archived: { not: true },

            projectId,
          },
        },
      },
      EnumBlockType.ServiceSettings,
      {
        path: ["serviceTemplateVersion", "serviceTemplateId"],
        equals: templateId,
      }
    );

    return blocks.map((block) => block.resourceId);
  }
}
