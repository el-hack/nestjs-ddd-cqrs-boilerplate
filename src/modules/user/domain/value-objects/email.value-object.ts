import { ValueObject } from '../../../../@core/domain/value-object.base';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  constructor(value: string) {
    super({ value });
    this.validate({ value });
  }

  get value(): string {
    return this.props.value;
  }

  protected validate(props: EmailProps): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!props.value) {
      throw new Error('Email is required');
    }

    if (!emailRegex.test(props.value)) {
      throw new Error('Invalid email format');
    }

    if (props.value.length > 254) {
      throw new Error('Email is too long');
    }
  }
}
