import { Injectable } from "@nestjs/common";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { PluginCatalogItem } from "./dto/PluginCatalogItem";
import { EnumCodeGenerator } from "../resource/dto/EnumCodeGenerator";

const GET_PLUGINS = gql`
  query GetPlugins($codeGeneratorName: String!) {
    plugins(where: { codeGeneratorName: { equals: $codeGeneratorName } }) {
      pluginId
      name
      icon
      description
      codeGeneratorName
      npm
      github
      categories
    }
  }
`;

@Injectable()
export class PluginCatalogService {
  private client: ApolloClient<any>;

  constructor(configService: ConfigService) {
    this.client = new ApolloClient({
      uri: configService.get<string>(Env.PLUGIN_API_URL),
      cache: new InMemoryCache({
        addTypename: false,
      }),
    });
  }

  async getPluginWithLatestVersion(
    pluginId: string
  ): Promise<PluginCatalogItem> {
    const query = gql`
      query GetPlugin($where: PluginWhereInput) {
        plugins(where: $where) {
          pluginId
          name
          icon
          description
          taggedVersions
          codeGeneratorName
          npm
          github
          categories
          versions(
            where: { deprecated: { equals: null } }
            orderBy: { createdAt: Desc }
          ) {
            id
            pluginId
            deprecated
            isLatest
            version
            settings
            configurations
          }
        }
      }
    `;

    try {
      const { data } = await this.client.query<{
        plugins: PluginCatalogItem[];
      }>({
        query,
        variables: {
          where: {
            categories: {}, //this is required to workaround an issue in the API
            pluginId: {
              equals: pluginId,
            },
          },
        },
      });
      const plugin =
        data.plugins && data.plugins.length ? data.plugins[0] : undefined;
      if (plugin) {
        const versions = plugin.versions.filter((version) => version.isLatest);
        return {
          ...plugin,
          versions,
        };
      }
      throw new Error(`Failed to fetch plugin with ID ${pluginId}`);
    } catch (error) {
      throw new Error(`Failed to fetch plugin with ID ${pluginId}: ${error}`);
    }
  }

  async getPlugins(
    codeGeneratorName: keyof typeof EnumCodeGenerator
  ): Promise<PluginCatalogItem[]> {
    try {
      const { data } = await this.client.query<{
        plugins: PluginCatalogItem[];
      }>({
        query: GET_PLUGINS,
        variables: {
          codeGeneratorName,
        },
      });
      return data.plugins;
    } catch (error) {
      throw new Error(`Failed to fetch plugins: ${error}`);
    }
  }
}
