import { GqlAuthGuard } from "../../../guards/gql-auth.guard";
import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { GqlResolverExceptionsFilter } from "../../../filters/GqlResolverExceptions.filter";
import { AuthorizeContext } from "../../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../../enums/AuthorizableOriginParameter";
import { User } from "../../../models";
import { UserEntity } from "../../../decorators/user.decorator";
import { DBSchemaImportService } from "./dbSchemaImport.service";
import { DBSchemaImportArgs } from "./dto";
import { graphqlUpload } from "../utils/graphql-upload";
import { UserAction } from "../dto";

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
    "resource.connect.id"
  )
  async createEntitiesFromPrismaSchema(
    @UserEntity() user: User,
    @Args() args: DBSchemaImportArgs,
    @Args({ name: "file", type: () => GraphQLUpload })
    file: FileUpload
  ): Promise<UserAction> {
    const fileContent = await graphqlUpload(file);

    return this.dbSchemaImportService.startProcessingPrismaSchema(
      fileContent,
      file.filename,
      args,
      user
    );
  }
}
