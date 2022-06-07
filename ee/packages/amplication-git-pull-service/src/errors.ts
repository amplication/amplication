import * as common from '@nestjs/common';

export class ForbiddenException extends common.ForbiddenException {
  statusCode!: number;
  message!: string;
}

export class NotFoundException extends common.NotFoundException {
  statusCode!: number;
  message!: string;
}
