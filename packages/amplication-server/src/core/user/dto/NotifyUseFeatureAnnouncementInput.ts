import { ApiProperty } from "@nestjs/swagger";

export class NotifyUseFeatureAnnouncementInput {
  @ApiProperty()
  userActiveDaysBack!: number;

  @ApiProperty()
  notificationId!: string;
}
