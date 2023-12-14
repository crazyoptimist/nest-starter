import { Logger } from "@aws-lambda-powertools/logger";
import { CostExplorerClient, GetCostAndUsageCommand, GroupDefinitionType } from "@aws-sdk/client-cost-explorer";
import { Injectable } from "@nestjs/common";
import { join } from "path";
import * as fs from 'fs';


@Injectable()
export class InfraCostService {
  private readonly logger = new Logger();
  private readonly costExplorerClient: CostExplorerClient;

  constructor() {
    this.costExplorerClient = new CostExplorerClient({ region: 'us-east-2' });
  }

  async getCostAndUsage(start: string, end: string, granularity: "DAILY" | "HOURLY" | "MONTHLY", format?: string): Promise<any> {

    const params = {
      TimePeriod: {
        Start: start,
        End: end
      },
      Granularity: granularity,
      Metrics: [
        'AmortizedCost',
        'BlendedCost',
        'NetAmortizedCost',
        'NetUnblendedCost',
        'NormalizedUsageAmount',
        'UnblendedCost',
        'UsageQuantity',

      ],
      GroupBy: [
        {
          Type: GroupDefinitionType.DIMENSION,
          Key: 'SERVICE'
        }
      ]
    };

    const command = new GetCostAndUsageCommand(params);
    const data = await this.costExplorerClient.send(command);
    this.logger.info(`Cost data: ${JSON.stringify(data)}`);
    // Format the data as per the 'format' parameter to convert to a csv
    if (format === 'csv') {
      let csvData = [];

      data.ResultsByTime.forEach(result => {
        result.Groups.forEach(group => {
          const service = group.Keys[0];
          const metrics = group.Metrics;
          const row = {
            TimePeriod: result.TimePeriod.Start,
            Service: service,
            AmortizedCost: metrics.AmortizedCost.Amount,
            BlendedCost: metrics.BlendedCost.Amount,
            NetAmortizedCost: metrics.NetAmortizedCost.Amount,
            NetUnblendedCost: metrics.NetUnblendedCost.Amount,
            NormalizedUsageAmount: metrics.NormalizedUsageAmount.Amount,
            UnblendedCost: metrics.UnblendedCost.Amount,
            UsageQuantity: metrics.UsageQuantity.Amount
          };
          csvData.push(row);
        });
      });

      const csvPath = join('/tmp', 'cost_data.csv');

      const writeStream = fs.createWriteStream(csvPath);
      writeStream.on('error', (err) => {
        this.logger.error(`Error writing CSV file: ${err}`);
      });

      // write the csv headers
      writeStream.write(Object.keys(csvData[0]).join(',') + '\n');
      csvData.forEach(row => {
        writeStream.write(Object.values(row).join(',') + '\n');
      })

      writeStream.end();
      this.logger.info(`CSV data written to ${csvPath}`);
      return csvData;
    }

    return data;

  }
}