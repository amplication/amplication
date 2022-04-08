#!/bin/sh
set -e;

node /app/inject-variables.js /app/index.html;

# Execute CMD
exec "$@";