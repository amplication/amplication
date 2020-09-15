#!/bin/bash
set -e;

# Run inject variables script
node /scripts/inject-variables.js;

# Execute CMD
exec "$@";