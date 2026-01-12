import { CommandFactory } from 'nest-commander';
import { CliModule } from './cli.module';

async function bootstrap() {
  await CommandFactory.run(CliModule, ['warn', 'error', 'log']);
}

bootstrap().catch((err) => {
  console.error('CLI Error:', err);
  process.exit(1);
});
