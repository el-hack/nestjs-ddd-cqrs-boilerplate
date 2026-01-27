import { v4 as uuidv4, validate } from 'uuid';
import { ValueObject } from '../value-object.base';

interface UuidProps {
  value: string;
}

export class UUID extends ValueObject<UuidProps> {
  constructor(value: string) {
    super({ value });
    this.validate({ value });
  }

  get value(): string {
    return this.props.value;
  }

  static generate(): UUID {
    return new UUID(uuidv4());
  }

  static from(value: string): UUID {
    return new UUID(value);
  }

  static parse(id: string): UUID {
    return new UUID(id);
  }

  protected validate(props: UuidProps): void {
    if (!props.value) {
      throw new Error('UUID value is required');
    }

    if (!validate(props.value)) {
      throw new Error('Invalid UUID format');
    }
  }
}
