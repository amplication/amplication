FROM nginx:1.20-alpine

RUN apk add --update nodejs

WORKDIR /app

COPY ./packages/amplication-client/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist/apps/@amplication/client .
COPY ./packages/amplication-client/src/scripts/inject-variables.js .
COPY ./packages/amplication-client/entrypoint.sh .

RUN chmod 755 entrypoint.sh

EXPOSE 8080

ENTRYPOINT [ "/app/entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
