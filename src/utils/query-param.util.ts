export type PaginationParam = {
  offset: number;
  limit: number;
};

export type SortParam = {
  fieldName: string;
  order: 'DESC' | 'ASC';
};

export type FilterParam = {
  fieldName: string;
  value: string | number;
  operator?:
    | 'eq'
    | 'ne'
    | 'lt'
    | 'gt'
    | 'lte'
    | 'gte'
    | 'in'
    | 'nin'
    | 'contains'
    | 'ncontains';
};

const OFFSET_KEY = '_offset';
const LIMIT_KEY = '_limit';
const SORT_KEY = '_sort';
const ORDER_KEY = '_order';

export function getPaginationParam(queryObject: Object): PaginationParam {
  let result: PaginationParam = {
    offset: 0,
    limit: 25, // Default per page
  };

  const isOffsetExists = Object.keys(queryObject).includes(OFFSET_KEY);
  const isLimitExists = Object.keys(queryObject).includes(LIMIT_KEY);

  if (isOffsetExists) {
    result.offset = queryObject[OFFSET_KEY];
  }
  if (isLimitExists) {
    result.limit = queryObject[LIMIT_KEY];
  }

  return result;
}

export function getSortParams(queryObject: Object): SortParam[] {
  const isSortExists = Object.keys(queryObject).includes(SORT_KEY);
  const isOrderExists = Object.keys(queryObject).includes(ORDER_KEY);
  if (!isSortExists || !isOrderExists) {
    return [];
  }

  const fields = (queryObject[SORT_KEY] as string).split(',');
  const orders = (queryObject[ORDER_KEY] as string).split(',');

  // Make sure the length of the fields and orders are
  // the same or take the smaller length
  let sortersLength =
    fields.length > orders.length ? orders.length : fields.length;

  let result: SortParam[] = [];

  for (let i = 0; i < sortersLength; i++) {
    const order = orders[i].toUpperCase();

    if (!(order === 'ASC' || order === 'DESC')) {
      continue;
    }

    result.push({
      fieldName: fields[i],
      order,
    });
  }

  return result;
}

// This function only supports eq operator for now
export function getFilterParams(queryObject: Object): FilterParam[] {
  const paginationAndSortKeys = [LIMIT_KEY, OFFSET_KEY, SORT_KEY, ORDER_KEY];

  let result: FilterParam[] = [];

  for (const [key, value] of Object.entries(queryObject)) {
    if (paginationAndSortKeys.includes(key)) {
      continue;
    }

    if (typeof value === 'object' && value.length > 0) {
      for (const item of value) {
        result.push({
          fieldName: key,
          value: item,
        });
      }
    } else {
      result.push({
        fieldName: key,
        value,
      });
    }
  }

  return result;
}
