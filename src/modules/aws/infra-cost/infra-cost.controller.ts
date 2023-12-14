import { ParseDateIsoPipe } from './parse-date.iso.pipe';
import { Controller, Get, Query } from '@nestjs/common';
import { Logger } from '@aws-lambda-powertools/logger';
import { InfraCostService } from './infra-cost.service';

@Controller('infra-cost')
export class InfraCostController {
    private readonly logger = new Logger();
    constructor(
        private readonly costService: InfraCostService
    ) { }

    @Get()
    async getInfrastructureCost(
        @Query('start', ParseDateIsoPipe) start: string,
        @Query('end', ParseDateIsoPipe) end: string,
        @Query('granularity') granularity: 'DAILY' | 'MONTHLY' | 'HOURLY',
        @Query('format') format: string
    ): Promise<any> {

        const defaultStart = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10);
        const defaultEnd = new Date().toISOString().slice(0, 10);
        start = start || defaultStart;
        end = end || defaultEnd;
        granularity = granularity || 'DAILY';
        this.logger.info(`Fetching cost data from ${start} to ${end} with granularity ${granularity}`);
        return this.costService.getCostAndUsage(start, end, granularity, format);
    }

}
