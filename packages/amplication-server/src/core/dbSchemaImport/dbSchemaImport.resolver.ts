import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { User } from "../../models";
import { UserEntity } from "../../decorators/user.decorator";
import { DBSchemaImportService } from "./dbSchemaImport.service";
import { graphqlUpload } from "../userAction/utils/graphql-upload";
import { UserAction } from "../userAction/dto";
import { DBSchemaImportMetadata } from "./types";
import { CreateDBSchemaImportArgs } from "./dto/CreateDBSchemaImportArgs";
import { CreateEntitiesFromPredefinedSchemaArgs } from "./dto/CreateEntitiesFromPredefinedSchemaArgs";
import { EnumUserActionType } from "../userAction/types";

@Resolver(() => UserAction)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class DBSchemaImportResolver {
  constructor(private readonly dbSchemaImportService: DBSchemaImportService) {}

  @Mutation(() => UserAction, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.ResourceId,
    "data.resource.connect.id"
  )
  async createEntitiesFromPrismaSchema(
    @UserEntity() user: User,
    @Args() args: CreateDBSchemaImportArgs,
    @Args({ name: "file", type: () => GraphQLUpload })
    file: FileUpload
  ): Promise<UserAction> {
    const fileContent = await graphqlUpload(file);
    const metadata: DBSchemaImportMetadata = {
      fileName: file.filename,
      schema: fileContent,
    };

    return this.dbSchemaImportService.startProcessingDBSchema(
      args,
      metadata,
      user
    );
  }

  @Mutation(() => UserAction, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.ResourceId,
    "data.resource.connect.id"
  )
  async createEntitiesFromPredefinedSchema(
    @UserEntity() user: User,
    @Args() args: CreateEntitiesFromPredefinedSchemaArgs
  ): Promise<UserAction> {
    const { schemaName, resource } = args.data;
    const schema = await this.dbSchemaImportService.getPredefinedSchema(
      schemaName
    );

    const schemaMetadata: DBSchemaImportMetadata = {
      fileName: schemaName,
      schema,
    };

    return this.dbSchemaImportService.startProcessingDBSchema(
      {
        data: {
          resource,
          userActionType: EnumUserActionType.DBSchemaImport,
        },
      },
      schemaMetadata,
      user
    );
  }
}
