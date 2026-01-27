import { ValueObject } from '../value-object.base';

interface IdProps {
  value: string;
}

export abstract class ID extends ValueObject<IdProps> {
  constructor(value?: string) {
    super({ value: value || ID.generate() });
  }

  get value(): string {
    return this.props.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: ID): boolean {
    return this.value === other.value;
  }

  private static generate(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
