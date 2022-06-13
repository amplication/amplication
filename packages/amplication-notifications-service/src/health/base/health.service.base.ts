import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthServiceBase {
  constructor() {}
  async isDbReady(): Promise<boolean> {
    try {
      console.log("Hello I am healthy");
      return true;
    } catch (error) {
      return false;
    }
  }
}
