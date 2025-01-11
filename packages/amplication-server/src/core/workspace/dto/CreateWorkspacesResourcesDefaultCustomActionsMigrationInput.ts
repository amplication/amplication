import { ApiProperty } from "@nestjs/swagger";

export class CreateWorkspacesResourcesDefaultCustomActionsMigrationInput {
  @ApiProperty()
  quantity!: number;
}

export class CreateWorkspacesResourcesDefaultCustomDtosMigrationInput {
  @ApiProperty()
  quantity!: number;

  @ApiProperty({
    nullable: true,
  })
  page?: number;
}
