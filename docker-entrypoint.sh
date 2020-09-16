#!/bin/bash
set -e;

# Run inject variables script
node /packages/amplication-client/src/scripts/inject-variables.js;

# Execute CMD
exec "$@";