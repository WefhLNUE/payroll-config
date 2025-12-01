import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      retryAttempts: 3,
      retryDelay: 5000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }),
  ],
})
export class AppModule {}
