import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

async function bootstrap() {
  try {
    // Check environment variables
    console.log('Checking environment variables...');
    const mongoUri = process.env.MONGO_URI;
    const port = process.env.PORT || 3000;

    if (!mongoUri) {
      console.error('ERROR: MONGO_URI environment variable is not set!');
      console.log('Please ensure .env file contains MONGO_URI');
      process.exit(1);
    }

    console.log('✓ MONGO_URI found');
    console.log('✓ PORT:', port);
    console.log('Initializing NestFactory...');

    const app = await NestFactory.create(AppModule);
    await app.listen(port);
    console.log(`✓ Application is running on port ${port}`);
  } catch (error) {
    console.error('Failed to start application:');
    if (error instanceof Error) {
      console.error('Error Message:', error.message);
      console.error('Stack:', error.stack);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}
bootstrap();
