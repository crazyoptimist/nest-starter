import { Module } from '@nestjs/common';
import { SnsController } from './sns/sns.controller';
import { HttpModule } from '@nestjs/axios';
import { InfraCostController } from './infra-cost/infra-cost.controller';
import { InfraCostService } from './infra-cost/infra-cost.service';

@Module({
  imports: [HttpModule],
  controllers: [SnsController, InfraCostController],
  providers: [InfraCostService],
})
export class AwsModule {}
