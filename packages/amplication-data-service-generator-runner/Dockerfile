FROM node:18.13.0-slim AS production

ARG component=data-service-generator-runner
ARG user=${component}
ARG uid=1001
ARG gid=$uid

RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        g++=4:10.2.1-1 \
        make=4.3-4.1 \
        python3=3.9.2-3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /workspace/packages/${user}

COPY ./dist/packages/amplication-${component} .

RUN npm install --omit-dev

RUN groupadd --gid ${gid} ${user} \
    && useradd --uid ${uid} --gid ${gid} -m ${user} \
    && chown -R ${uid}:${gid} /workspace/packages/

USER ${user}
