import { Injectable } from "@nestjs/common";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { PluginCatalogItem } from "./dto/PluginCatalogItem";

@Injectable()
export class PluginCatalogService {
  private client: ApolloClient<any>;

  constructor(configService: ConfigService) {
    this.client = new ApolloClient({
      uri: configService.get<string>(Env.PLUGIN_API_URL),
      cache: new InMemoryCache(),
    });
  }

  async getPlugin(pluginId: string): Promise<PluginCatalogItem> {
    const query = gql`
      query GetPlugins($where: PluginWhereInput) {
        plugins(where: $where) {
          pluginId
          name
          icon
          description
          taggedVersions
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
            pluginId: {
              equals: pluginId,
            },
          },
        },
      });
      return data.plugins && data.plugins.length ? data.plugins[0] : undefined;
    } catch (error) {
      throw new Error(`Failed to fetch plugin with ID ${pluginId}: ${error}`);
    }
  }

  async getPlugins(): Promise<PluginCatalogItem[]> {
    const query = gql`
      query GetPlugins {
        plugins {
          pluginId
          name
          icon
          description
          npm
          github
          categories
        }
      }
    `;

    try {
      const { data } = await this.client.query<{
        plugins: PluginCatalogItem[];
      }>({
        query,
      });
      return data.plugins;
    } catch (error) {
      throw new Error(`Failed to fetch plugins: ${error}`);
    }
  }
}
