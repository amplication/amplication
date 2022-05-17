import { Module } from "./module";


export type CreateAuthModules = (authDir: string) => Module[]
export type UpdateAuthModules = (staticModules: Module[], appModule: Module, authDir: string) => void

interface IHook {
    name: string;
}

class CreateAuthHook implements IHook {
    name = "createAuth";
}

enum EventType {
    BeforeAuthModuleCreate
}

type HookHandler<T extends IHook> = (hook: T) => void


class HookService {

    registry = new Map<string, HookHandler<IHook>[]>();

    constructor() { 
        // this.registry.set(CreateAuthHook.name, []);
    }

    // private register<T extends IHook>(hook: T, action: HookHandler<T>) {
    //     if (this.registry.get(hook.name)) {
    //         this.registry.set(hook.name, [])
    //     }
    //     this.registry.get(hook.name)?.push(action);
    // }

    register(hook: IHook, action: HookHandler<IHook>) {
        this.registry.get(hook.name)?.push(action);
    }

    registerBeforeAuthModuleCreate(action: HookHandler<CreateAuthHook>) {
        // this.register(CreateAuthHook, action);
        this.registry.get(CreateAuthHook.name)?.push(action);
    }

    runHook<T extends IHook>(hook: T) {
        this.registry.get(hook.name)?.forEach(action => action(hook));
    }
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
        this.hookService.register(CreateAuthHook, this.createAuthHookHandler)
    }

    createAuthHookHandler = (hook: CreateAuthHook) => {
        console.log(hook.name)
    }
}