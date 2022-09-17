import {Serializer} from "../types/serializer";
import {Injectable} from "@nestjs/common";

@Injectable()
export class StringSerializerService implements Serializer<string> {

    deserialize(value: Buffer | null): string {
        if (value) {
            return value.toString()
        }
        return ""
    }

    serialize(value: string): string {
        return value;
    }

}
