# Amplication Deployer

Multi-provider service for deployment using Terraform.

### Example

```typescript
import { Deployer } from "@amplication/deployer";
import { GCPProvider } from "@amplication/deployer/gcp";
import { Storage } from "@google-cloud/storage";
import { CloudBuildClient } from "@google-cloud/cloudbuild";

const deployer = new Deployer({
  default: "gcp",
  providers: {
    gcp: new GCPProvider(
      new CloudBuildClient(),
      new Storage(),
      process.env.PROJECT_ID,
      process.env.BUCKET
    ),
  },
});
```

### Nest.js integration

`example.service.ts`:

```typescript
import { DeployerService } from "@amplication/deployer/dist/nestjs";

@Injectable()
class ExampleService {
  constructor(private readonly deployerService: DeployerService);
}
```

`example.module.ts`:

```typescript
import { DeployerModule } from "@amplication/deployer/dist/nestjs";
import { GCPProvider } from "@amplication/container-builder/dist/gcp";
import { CloudBuildClient } from "@google-cloud/cloudbuild";
import { Storage } from "@google-cloud/storage";

@Module({
  imports: [
    ContainerBuilderModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const projectId = configService.get("PROJECT_ID");
        const bucket = configService.get("BUCKET");
        return {
          default: "gcp",
          providers: {
            gcp: new GCPProvider(
              new CloudBuildClient(),
              new Storage(),
              projectId,
              bucket
            ),
          },
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
})
class ExampleModule {}
```
