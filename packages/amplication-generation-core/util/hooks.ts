import { Module } from "../types/module";
import { DsgContext } from "../types/context";


export type CreateAuthModules = (authDir: string) => Module[]
export type UpdateAuthModules = (staticModules: Module[], appModule: Module, authDir: string) => void

export interface IHook {
    hookName: string;
}

export class CreateAuthHook implements IHook {
    hookName = "createAuth";
    context: DsgContext;
    appModule: Module;
    authModulePath: string;

    constructor(context: DsgContext, appModule: Module, authModulePath: string) {
        this.context = context;
        this.appModule = appModule;
        this.authModulePath = authModulePath;
    }
}

export enum EventType {
    BeforeAuthModuleCreate
}

export type HookHandler<T extends IHook> = (hook: T) => void


export class HookService {

    // registry = new Map<string, HookHandler<IHook>[]>();

    private static instance: HookService;

    public static get getInstance(): HookService {
        return this.instance || (this.instance = new this());
    }

    createAuthHandlers: HookHandler<CreateAuthHook>[] = [];

    // constructor() { 
    // this.registry.set(CreateAuthHook.name, []);
    // }
    // private register<T extends IHook>(hook: T, action: HookHandler<T>) {
    //     if (this.registry.get(hook.name)) {
    //         this.registry.set(hook.name, [])
    //     }
    //     this.registry.get(hook.name)?.push(action);
    // }

    // constructor() { 
    // this.registry.set(CreateAuthHook.name, []);
    // }

    // private register<T extends IHook>(hook: T, action: HookHandler<T>) {
    //     if (this.registry.get(hook.name)) {
    //         this.registry.set(hook.name, [])
    //     }
    //     this.registry.get(hook.name)?.push(action);
    // }

    // register(hook: IHook, action: HookHandler<IHook>) {
    //     this.registry.get(hook.name)?.push(action);
    // }

    registerCreateAuthHookHandler(action: HookHandler<CreateAuthHook>) {
        // this.register(CreateAuthHook, action);
        this.createAuthHandlers.push(action);
    }



    runHook<T extends IHook>(hook: T) {
        // this.registry.get(hook.name)?.forEach(action => action(hook));
        switch (hook.hookName) {
            case 'createAuth':
                const createAuthHook = hook as unknown as CreateAuthHook
                this.createAuthHandlers.forEach(action => action(createAuthHook))
        }
    }
}

export interface IPlugin {
    register(hookService: HookService): void
}

class Plugin {
    private hookService: HookService

    constructor(
        hookService: HookService,
    ) {
        this.hookService = hookService;
        this.register()
    }

    register() {
        this.hookService.registerCreateAuthHookHandler(this.createAuthHookHandler)
    }

    createAuthHookHandler = (hook: CreateAuthHook) => {
        console.log(hook.hookName)
    }
}

