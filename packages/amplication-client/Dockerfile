FROM nginx:1.22-alpine

ARG component=client
ARG user=nginx
ARG group=${user}

RUN apk add --update-cache nodejs

WORKDIR /app

COPY ./packages/amplication-${component}/configuration/nginx.conf /etc/nginx/nginx.conf
COPY ./packages/amplication-${component}/configuration/default.conf /etc/nginx/conf.d/default.conf
COPY ./dist/packages/amplication-${component} .

RUN chown -R nginx:nginx /app && chmod -R 755 /app && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /etc/nginx/conf.d/default.conf

RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER ${user}

RUN chmod +x scripts/entrypoint.sh
ENTRYPOINT [ "/app/scripts/entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
