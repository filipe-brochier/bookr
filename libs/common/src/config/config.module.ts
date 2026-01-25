import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z.url(),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      validate: (config) => envSchema.parse(config),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  /* */
}
