#!/bin/bash
set -e;

# Run inject variables script
CLIENT_DIRECTORY=/app/packages/amplication-client;
node $CLIENT_DIRECTORY/src/scripts/inject-variables.js $CLIENT_DIRECTORY/build/index.html;

# Execute CMD
exec "$@";