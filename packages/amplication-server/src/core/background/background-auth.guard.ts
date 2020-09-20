import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NAME } from './background-jwt.strategy';

@Injectable()
export class BackgroundAuthGuard extends AuthGuard(NAME) {}
