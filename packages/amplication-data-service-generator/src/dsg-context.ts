import { inject, singleton } from "tsyringe";
import { AppInfo } from "./types";


export class AppData {
    id: string;
    url: string;
    name: string;
    description: string;
    version: string;

    constructor(
        id: string, 
        url: string, 
        name: string, 
        description: string, 
        version: string
    ) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.version = version;
        this.description = description;
    }
}


@singleton()
export class DsgContext {
    constructor(
        @inject("appData") public appData: AppData,
        @inject("appInfo") public appInfo: AppInfo,
    ) {}
}

