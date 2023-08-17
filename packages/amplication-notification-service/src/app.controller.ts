import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern("/^[a-zA-Z0-9.]+$/")
  getHello(@Payload() message) {
    // validate message
    console.log(message.value);
    return this.appService.getHello();
  }
}
