import { DataSource } from 'typeorm';

// --- Postgres ---
export const postgresDb = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  username: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DATABASE || 'postgres',
});

const postgresSchema = process.env.POSTGRES_SCHEMA || 'public';
let dbInitialized = false;

const initializeDb = async () =>
  postgresDb
    .initialize()
    .then(async () => {
      console.log('Database initialized!');
      try {
        await postgresDb.query(
          `CREATE TABLE IF NOT EXISTS ${postgresSchema}.users (id varchar(50), name varchar(50))`,
        );
        console.log('Users table has been created!');

        await postgresDb.query(
          `CREATE TABLE IF NOT EXISTS ${postgresSchema}.gigs (id varchar(50), user_id varchar(50), title varchar(50))`,
        );
        console.log('Gigs table has been created!');

        await postgresDb.query(
          `CREATE TABLE IF NOT EXISTS ${postgresSchema}.orders (id varchar(50), gig_id varchar(50), seller_id varchar(50), buyer_id varchar(50))`,
        );
        console.log('Orders table has been created!');

        dbInitialized = true;
      } catch (err) {
        console.error('Error creating postgres table', err);
      }
    })
    .catch((err) => {
      console.error('Error during orders data source initialization', err);
    });

export const initializeDbIfNeeded = async () => {
  if (!dbInitialized) {
    await initializeDb();
  }
};
