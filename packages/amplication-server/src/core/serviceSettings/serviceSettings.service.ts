import { Injectable } from "@nestjs/common";
import { cloneDeep, merge } from "lodash";
import { FindOneArgs } from "../../dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { User } from "../../models";
import { PrismaService } from "../../prisma";
import { BlockService } from "../block/block.service";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { DEFAULT_SERVICE_SETTINGS, ServiceSettingsValues } from "./constants";
import { ServiceSettings, UpdateServiceSettingsArgs } from "./dto";
import { EnumAuthProviderType } from "./dto/EnumAuthenticationProviderType";
import { ServiceSettingsUpdateInput } from "./dto/ServiceSettingsUpdateInput";

export const isStringBool = (val: string | boolean): boolean =>
  typeof val === "boolean" || typeof val === "string";

@Injectable()
export class ServiceSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockService: BlockService
  ) {}

  async getServiceSettingsValues(
    args: FindOneArgs,
    user: User
  ): Promise<ServiceSettingsValues> {
    const { authProvider, serverSettings, adminUISettings, authEntityName } =
      await this.getServiceSettingsBlock(args, user);

    return {
      resourceId: args.where.id,
      authProvider,
      serverSettings,
      adminUISettings,
      authEntityName,
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
      const resource = await this.prisma.resource.findUnique({
        where: {
          id: args.where.id,
        },
      });

      if (
        resource.resourceType !== EnumResourceType.Service &&
        resource.resourceType !== EnumResourceType.ServiceTemplate
      ) {
        return null;
      }

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

  async createDefaultServiceSettings(
    resourceId: string,
    user: User,
    serviceSettings: ServiceSettingsUpdateInput = null
  ): Promise<ServiceSettings> {
    const defaultSettings = cloneDeep(DEFAULT_SERVICE_SETTINGS);

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
}
