import { BaseQuery } from '../../../../@core/application/query.base';

export class GetUserQuery extends BaseQuery {
  constructor(
    public readonly userId: string,
    correlationId?: string,
  ) {
    super(correlationId);
  }
}
