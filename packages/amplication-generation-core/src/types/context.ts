import { AppInfo, Entity, Module, Role } from "./types";


export class DsgContext {

    public appInfo!: AppInfo;
    public entities: Entity[] = [];
    public roles: Role[] = [];
    public modules: Module[] = [];

    private static instance: DsgContext;

    public static get getInstance(): DsgContext {
        return this.instance || (this.instance = new this());
    }
}

