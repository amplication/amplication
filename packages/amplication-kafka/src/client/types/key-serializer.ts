export interface KeySerializer<T>{
    serialize(key:T):string
    deserialize(key:Buffer | null):T
}