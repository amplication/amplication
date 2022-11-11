FROM nginx:1.20-alpine

RUN apk add --update nodejs

WORKDIR /app

COPY ./apps/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist/apps/client .

RUN chmod +x scripts/entrypoint.sh
ENTRYPOINT [ "/app/scripts/entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
