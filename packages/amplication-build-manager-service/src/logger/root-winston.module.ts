import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from './winstonConfig.service';

export const RootWinstonModule = WinstonModule.forRootAsync({
  imports: [ConfigModule],
  useClass: WinstonConfigService,
});
