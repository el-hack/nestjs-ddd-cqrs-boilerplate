import { Injectable } from '@nestjs/common';
import { EventAwareMapperBase } from '../../../../@core/infrastructure/mappers/event-aware-mapper.base';
import { User, UserProps } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';
import { Email } from '../../domain/value-objects/email.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapperBase,
} from '@core/infrastructure/mappers/orm-mapper.base';
import { UUID } from '@core/domain';

@Injectable()
export class UserMapper extends OrmMapperBase<User, UserOrmEntity> {
  protected toDomainProps(ormEntity: UserOrmEntity): EntityProps<UserProps> {
    return {
      id: UUID.parse(ormEntity.id),
      props: {
        email: new Email(ormEntity.email),
        firstName: ormEntity.firstName,
        lastName: ormEntity.lastName,
        isActive: ormEntity.isActive,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
      },
    };
  }
  protected toOrmProps(entity: User): OrmEntityProps<UserOrmEntity> {
    return {
      email: entity.email.value,
      firstName: entity.firstName,
      lastName: entity.lastName,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
