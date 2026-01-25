import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [DatabaseModule],
})
export class AppModule {
  /* */
}
