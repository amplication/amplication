import { AuthGuard } from "@nestjs/passport";

export class BasicAuthGuard extends AuthGuard("basic") {}
