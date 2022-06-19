import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { CodeGenerationInput } from "@amplication/data-service-generator";


@Injectable()
export class CodeGenStorageService {

    private client: S3Client;

    constructor(private readonly configService: ConfigService) {

        this.client = new S3Client({
            credentials: {
                accessKeyId: configService.get('AWS_KEY_ID'),
                secretAccessKey: configService.get('AWS_SECRET_KET'),
            }
        })
    }

    public saveCodeGenInput(codeGenInput: CodeGenerationInput): Promise<PutObjectCommandOutput> {
        const uploadParams: PutObjectCommandInput = {
            Bucket: this.configService.get('AWS_S3_CODE_GEN_INPUT_BUCKET'),
            Key: `code-gen-input/${codeGenInput.appInfo.version}`,
            Body: JSON.stringify(codeGenInput),
        };

        return this.client.send(new PutObjectCommand(uploadParams));
    }
}