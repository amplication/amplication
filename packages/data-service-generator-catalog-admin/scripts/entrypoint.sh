#!/bin/sh
set -e;

node /app/scripts/inject-variables.js /usr/share/nginx/html/index.html;

# Execute CMD
exec "$@";