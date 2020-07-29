set -e;

npm run db-migrate-save -- --name "initial version" --create-db;
npm run db-migrate-up;
node scripts/seed.js;