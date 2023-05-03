import { Injectable } from '@nestjs/common';
import { Connection, getEntityManager } from '@typedorm/core';
import { getTypeDormConnectionToken } from '@nest-dynamodb/typedorm';

@Injectable()
export class AppService {
  constructor() {}

  async ddb_test() {
    const entityManager = getEntityManager('ddbInstance');
    console.log('Using the entity manager to do something');
  }
}
