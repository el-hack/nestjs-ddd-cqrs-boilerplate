import { DomainException } from './domain.exception';

export class ArgumentInvalidException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
