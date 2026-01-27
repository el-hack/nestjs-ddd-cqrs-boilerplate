import { v4 as uuidv4 } from 'uuid';
import { AggregateRoot } from '@core/domain/aggregate-root.base';
import { Email } from '../value-objects/email.value-object';
import { UUID } from '@core/domain';

export interface UserProps {
  email: Email;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot<UserProps> {
  constructor(props: UserProps, id: UUID) {
    super(props, id.value);
  }

  public static create(props: UserProps): User {
    return new User(props, UUID.generate());
  }

  get email(): Email {
    return this.props.email;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public updateProfile(firstName: string, lastName: string): void {
    this.props.firstName = firstName;
    this.props.lastName = lastName;
    this.props.updatedAt = new Date();
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  public activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  protected generateId(): string {
    return uuidv4();
  }
}
