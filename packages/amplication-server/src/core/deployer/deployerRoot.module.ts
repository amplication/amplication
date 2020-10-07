import { ConfigModule } from '@nestjs/config';
import { DeployerModule } from 'amplication-deployer/dist/nestjs';
import { DeployerOptionsService } from './deployerOptions.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DeployerRootModule = DeployerModule.forRootAsync({
  useClass: DeployerOptionsService,
  imports: [ConfigModule]
});
