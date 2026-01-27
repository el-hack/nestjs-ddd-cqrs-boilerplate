import { BaseCommand } from '../../../../@core/application/command.base';

export class CreateUserCommand extends BaseCommand {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    correlationId?: string,
  ) {
    super(correlationId);
  }
}
