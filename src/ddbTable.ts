import { Table } from '@typedorm/common';

// create table
export const ddbGlobalTable = new Table({
  name: 'CarmaTech-API',
  partitionKey: 'PK',
});
