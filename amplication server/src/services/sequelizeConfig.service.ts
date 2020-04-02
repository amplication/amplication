//Sequelize is not in use. To start using it - add the following code to app.module.ts

// SequelizeModule.forRootAsync({
//   useClass: SequelizeConfigService,
// }),


// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { SequelizeOptionsFactory, SequelizeModuleOptions } from '@nestjs/sequelize'

// @Injectable()
// export class SequelizeConfigService implements SequelizeOptionsFactory {
//   constructor(
//     private configService: ConfigService,
//   ) {}

//   createSequelizeOptions(): SequelizeModuleOptions {
//     return {
//       dialect: 'postgres',
//       host: this.configService.get('POSTGRES_HOST'),
//       port: parseInt(this.configService.get('POSTGRES_PORT')),
//       username: this.configService.get('POSTGRES_USER'),
//       password: this.configService.get('POSTGRES_PASSWORD'),
//       database: this.configService.get('POSTGRES_DATABASE'),
//       //models: [],
//       autoLoadModels: true, //With that option specified, every entity registered through the forFeature() method will be automatically added to the entities array of the configuration object.
//       ssl: this.configService.get('DEBUG_MODE') === '1' ? false : true,
//       synchronize: false,
//     };
//   }
// }

