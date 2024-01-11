import { AwsEcrService } from "./aws-ecr.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [],
  providers: [AwsEcrService],
  exports: [AwsEcrService],
})
export class AwsEcrModule {}
