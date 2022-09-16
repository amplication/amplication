export interface ValueSerializer<T>{
    serialize(value:T):string
    deserialize(value:Buffer | null):T
}