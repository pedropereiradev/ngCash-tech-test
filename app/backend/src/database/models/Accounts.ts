import { UUID, DECIMAL, UUIDV4 } from 'sequelize'
import { Model, Optional } from 'sequelize'
import db from './';

type AccountsAttributes = {
  id: string
  balance: number
}

type AccountsCreationAttributes = Optional<AccountsAttributes, 'id'>

export default class Accounts extends Model<AccountsAttributes, AccountsCreationAttributes> {
  declare id: string;
  declare balance: number;
}

Accounts.init(
  {
    id: {
      type: UUID,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    balance: {
      type: DECIMAL,
      allowNull: false
    }
  },
  {
    sequelize: db,
    modelName: 'accounts',
    timestamps: false,
    underscored: true
  }
)