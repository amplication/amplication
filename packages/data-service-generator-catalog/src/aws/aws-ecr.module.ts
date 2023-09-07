import { Module } from "@nestjs/common";
import { AwsEcrService } from "./aws-ecr.service";

@Module({
  imports: [],
  controllers: [],
  providers: [AwsEcrService],
  exports: [AwsEcrService],
})
export class AwsEcrModule {}
