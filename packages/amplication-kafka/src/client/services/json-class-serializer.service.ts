import {Serializer} from "../types/serializer";
import {Injectable} from "@nestjs/common";

@Injectable()
export class JsonClassSerializer<T> implements Serializer<T> {

    deserialize(value: Buffer | null): T {
        try {
            if (value) {
                return JSON.parse(value.toString())
            }
        } catch (_) {

        }
        return value as unknown as T
    }

    serialize(value: T): string {
        return JSON.stringify(value);
    }
}
