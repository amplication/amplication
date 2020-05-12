//TypeORM is not in use. To start using it - add the following code to app.module.ts
// TypeOrmModule.forRootAsync({
//   useClass: TypeOrmConfigService,
// }),

// import {
//   Injectable,
//   Request,
//   Inject,
//   Scope,
//   ExecutionContext
// } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmOptionsFactory,TypeOrmModuleOptions } from '@nestjs/typeorm'

// @Injectable()
// export class TypeOrmConfigService implements TypeOrmOptionsFactory {
//   constructor(
//     private configService: ConfigService,
//   ) {}

//   createTypeOrmOptions(): TypeOrmModuleOptions {
//     return {

//       type: 'postgres',

//       host: this.configService.get('POSTGRES_HOST'),
//       port: parseInt(this.configService.get('POSTGRES_PORT')),
//       username: this.configService.get('POSTGRES_USER'),
//       password: this.configService.get('POSTGRES_PASSWORD'),
//       database: this.configService.get('POSTGRES_DATABASE'),

//       //entities: ['**/*.entity{.ts,.js}'],
//       autoLoadEntities: true, //With that option specified, every entity registered through the forFeature() method will be automatically added to the entities array of the configuration object.
//       migrationsTableName: 'migration',

//       migrations: ['src/migration/*.ts'],

//       cli: {
//         migrationsDir: 'src/migration',
//       },

//       ssl: this.configService.get('DEBUG_MODE') === '1' ? false : true,

//       synchronize: true,
//     };
//   }
// }
