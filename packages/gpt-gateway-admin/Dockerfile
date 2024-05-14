# multi-stage: base (build)
FROM node:18.13.0 AS base

# create directory where the application will be built
WORKDIR /app

# copy over the code base
COPY ./packages/gpt-gateway-admin/ .
 
# multi-stage: production (runtime)
FROM nginx:1.22-alpine AS production
RUN apk add --update nodejs

# copy over the bundled code from the build stage
COPY --from=base /app/build /usr/share/nginx/html
COPY --from=base /app/configuration/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=base /app/scripts/ ./app/scripts

# create a new process indication file
RUN touch /var/run/nginx.pid

RUN chmod +x app/scripts/entrypoint.sh
ENTRYPOINT [ "/app/scripts/entrypoint.sh" ]

# change ownership of nginx related directories and files
RUN chown -R nginx:nginx /var/run/nginx.pid \
        /usr/share/nginx/html \
        /var/cache/nginx \
        /var/log/nginx \
        /etc/nginx/conf.d

# set user to the created non-privileged user
USER nginx

# expose a specific port on the docker container
ENV PORT=8080
EXPOSE ${PORT}

# start the server using the previously build application
CMD ["nginx", "-g", "daemon off;"]