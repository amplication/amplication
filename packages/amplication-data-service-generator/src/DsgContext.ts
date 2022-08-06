import * as types from "@amplication/code-gen-types";

export class DsgContext implements types.DsgContext {
  public appInfo!: types.AppInfo;
  public entities: types.Entity[] = [];
  public roles: types.Role[] = [];
  public modules: types.Module[] = [];

  private static instance: types.DsgContext;

  public static get getInstance(): types.DsgContext {
    return this.instance || (this.instance = new this());
  }
}
