import { Module } from '@nestjs/common';
import { SnsController } from './sns/sns.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SnsController]
})
export class AwsModule {}
