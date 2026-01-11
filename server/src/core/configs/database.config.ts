import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver, defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import * as dotenv from 'dotenv';
import { ENV_KEY } from '../../shared/constants';

const NODE_ENV = process.env.NODE_ENV || 'dev';

dotenv.config({ path: `.env.${NODE_ENV}` });

export const databaseConfig = defineConfig({
  driver: PostgreSqlDriver,
  clientUrl: process.env[ENV_KEY.DATABASE_URL],
  entities: ['dist/core/database/entities/**/*.entity.js'],
  entitiesTs: ['src/core/database/entities/**/*.entity.ts'],
  debug: false,
  highlighter: new SqlHighlighter(),
  extensions: [Migrator, SeedManager],

  migrations: {
    path: 'dist/core/database/migrations',
    pathTs: 'src/core/database/migrations',
  },
  seeder: {
    path: 'dist/core/database/seeders',
    pathTs: 'src/core/database/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
});

// const config: Options = {
//   driver: PostgreSqlDriver,
//   host: process.env.DATABASE_HOST || 'localhost',
//   port: parseInt(process.env.DATABASE_PORT || '5432', 10),
//   user: process.env.DATABASE_USER || 'postgres',
//   password: process.env.DATABASE_PASSWORD || 'postgres',
//   dbName: process.env.DATABASE_NAME || 'orbit',
//   entities: ['dist/entities/**/*.entity.js', 'entities/**/*.entity.ts'],
//   entitiesTs: ['entities/**/*.entity.ts'],
//   debug: process.env.NODE_ENV !== 'production',
//   metadataProvider: TsMorphMetadataProvider,
//   migrations: {
//     path: 'dist/migrations',
//     pathTs: 'src/migrations',
//     tableName: 'mikro_orm_migrations',
//     glob: '!(*.d).{js,ts}',
//     transactional: true,
//     disableForeignKeys: false,
//     allOrNothing: true,
//     dropTables: false,
//     safe: false,
//     snapshot: false,
//     emit: 'ts',
//   },
// };

export default databaseConfig;
