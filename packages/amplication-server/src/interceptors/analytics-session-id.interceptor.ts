import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const INJECT_CONTEXT_VALUE = "injectContextValue";

const ANALYTICS_SESSION_ID_HEADER_KEY = "analytics-session-id";

@Injectable()
export class AnalyticsSessionIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const graphqlContext = GqlExecutionContext.create(context);
    const { req } = graphqlContext.getContext();

    const analyticsSessionId = req.headers[ANALYTICS_SESSION_ID_HEADER_KEY];
    req.analyticsSessionId = analyticsSessionId;

    return next.handle();
  }
}
