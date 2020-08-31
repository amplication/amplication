# Amplication Server

### Development

- Make sure you have Node.js and Docker installed
- Install dependencies of the monorepo (execute in root directory):
  ```
  npm install
  npm run bootstrap
  ```
- Build all packages
  ```
  npm run build
  ```
- Get database services up (execute in server directory):
  ```
  npm run docker:db
  ```
- Update application database
  ```
  npm run start:db
  ```
- Start the development server and watch for changes
  ```
  npm run start:watch
  ```
- Format files (editors like VSCode can do it for you automatically)
  ```
  npm run format
  ```
- Lint files (editors like VSCode come with integration to display those continuously)
  ```
  npm run lint
  ```
- Run tests and watch for changes
  ```
  npm run test:watch
  ```
- Update Prisma Schema
  ```
  npm run migrate:save
  npm run migrate:up
  npm run prisma:generate
  ```
