# Scheduler 

Simple HTTP cron job scheduler

### Usage

#### Run in Docker with parameters

```
docker run amplication/scheduler --request.url https://example.com --schedule "* * * * *"
```

#### Run in Docker with a configuration file

```
docker run -v $PWD/config.json:/etc/scheduler/config amplication/scheduler
```

_config.json_

```
{
  "$schema": "../src/config.schema.json",
  "request": {
    "url": "http://example.com"
  },
  "schedule": "* * * * *"
}
```

#### With Docker Compose

_docker-compose.yaml_

```yaml
services:
  scheduler:
    image: amplication/scheduler
    volumes:
      - ./config.json:/etc/scheduler/config
```

### Development

- Install dependencies

```
npm install
```

- Build

```
npm run build
```

- Start

```
node dist/index.js
```

### Inspiration

- [Google Cloud Scheduler](https://cloud.google.com/scheduler)
