import { STRING, UUIDV4 } from 'sequelize';
import { UUID } from 'sequelize';
import { Model, Optional } from 'sequelize'
import db from './';
import Accounts from './Accounts';

type UsersAttributes = {
  id: string
  username: string
  password: string
  accountId: string
}

type UsersCreationAttributes = Optional<UsersAttributes, 'id'>

export default class Users extends Model<UsersAttributes, UsersCreationAttributes> {
  declare id: string;
  declare username: string;
  declare password: string;
  declare accountId: string;
}

Users.init(
  {
    id: {
      type: UUID,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    username: {
      type: STRING,
      allowNull: false
    },
    password: {
      type: STRING,
      allowNull: false
    },
    accountId: {
      type: UUID,
      allowNull: false,
    }
  },
  {
    sequelize: db,
    tableName: 'users',
    timestamps: false,
    underscored: true
  }
);

Users.belongsTo(Accounts, { foreignKey: 'id' });