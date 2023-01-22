import { Injectable } from "@nestjs/common";
import { KafkaServiceBase } from "./base/kafka.service.base";

@Injectable()
export class KafkaService extends KafkaServiceBase {}
