export const KAFKA_KEY_SERIALIZER = "KAFKA_KEY_SERIALIZER"
export const KAFKA_VALUE_SERIALIZER = "KAFKA_VALUE_SERIALIZER"

export interface Serializer<T>{
    serialize(value:T):string
    deserialize(value:Buffer | null):T
}