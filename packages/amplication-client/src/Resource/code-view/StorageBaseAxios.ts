import axios, { AxiosInstance } from "axios";
import { getToken } from "../../authentication/authentication";
import { REACT_APP_STORAGE_GATEWAY_URL } from "../../env";
import { NodeTypeEnum } from "./NodeTypeEnum";
import assert from "assert";

export type StorageResponseType = {
  count: number;
  result: StorageResponseFile[];
  success: true;
};

export type StorageResponseFile = {
  name: string;
  type: NodeTypeEnum;
  path: string;
};

export class StorageBaseAxios {
  private axios: AxiosInstance | undefined;
  private constructor() {
    const token = getToken();
    if (!token) {
      throw new Error("Jwt token is missing");
    }
    this.axios = axios.create({
      baseURL: `${REACT_APP_STORAGE_GATEWAY_URL}/storage`,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  private static _instance: StorageBaseAxios | undefined;

  public static get instance(): StorageBaseAxios {
    if (!StorageBaseAxios._instance) {
      StorageBaseAxios._instance = new StorageBaseAxios();
    }
    return StorageBaseAxios._instance;
  }

  async fileContent(
    resourceId: string,
    buildId: string,
    path: string
  ): Promise<string> {
    assert(this.axios);

    const data = (
      await this.axios.get(`${resourceId}/${buildId}/content?path=${path}`, {
        // overwrite the parsing of json object by axios to prevent returning a object instead of string
        transformResponse: (res) => {
          return res;
        },
      })
    ).data;

    assert(typeof data === "string");

    return data;
  }

  async folderList(
    resourceId: string,
    buildId: string,
    path: string
  ): Promise<StorageResponseType> {
    assert(this.axios);

    const data = (
      await this.axios.get<StorageResponseType>(
        `${resourceId}/${buildId}/list?path=${path}`
      )
    ).data;
    return data;
  }
}
