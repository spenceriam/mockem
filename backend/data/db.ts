import { SQLDatabase } from 'encore.dev/storage/sqldb';

export const mockemDB = new SQLDatabase("mockem", {
  migrations: "./migrations",
});
