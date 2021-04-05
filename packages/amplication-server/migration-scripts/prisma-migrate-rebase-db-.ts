// 2021-04-03 Script to rebase existing amplication DB with the new Prisma migrations

// First, manually delete the _migrations table from the DB
// Execute from bash (set user and password)
// $ POSTGRESQL_URL=postgres://[user]:[password]@127.0.0.1:5432/app-database npx prisma migrate resolve --applied "20210403074551_init_schema"
