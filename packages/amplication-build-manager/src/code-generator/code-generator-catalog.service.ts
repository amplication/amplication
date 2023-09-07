import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Env } from "../env";
import { Traceable } from "@amplication/opentelemetry-nestjs";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types/models";
import axios from "axios";
import { Version } from "./version.interface";

@Traceable()
@Injectable()
export class CodeGeneratorService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  async getCodeGeneratorVersion({
    codeGeneratorVersion,
    codeGeneratorStrategy,
  }: {
    codeGeneratorVersion?: string;
    codeGeneratorStrategy?: CodeGeneratorVersionStrategy;
  }): Promise<string | undefined> {
    const catalogServiceUrl = this.configService.get(
      Env.DSG_CATALOG_SERVICE_URL
    );
    try {
      const response = await axios.post(
        `${catalogServiceUrl}api/versions/code-generator-version`,
        {
          codeGeneratorVersion,
          codeGeneratorStrategy,
        }
      );

      return (<Version>response.data).name;
    } catch (error) {
      throw new Error(error.message, {
        cause: {
          code: error.response?.status,
          message: error.response?.data?.message,
        },
      });
    }
  }
}
