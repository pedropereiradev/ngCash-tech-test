import { DECIMAL, NOW } from 'sequelize'
import { DATE } from 'sequelize'
import { UUID, UUIDV4 } from 'sequelize'
import { Model, Optional } from 'sequelize'
import db from './';
import Accounts from './Accounts';

type TransactionsAttributes = {
  id: string,
  debitedAccountId: string
  creditedAccountId: string
  value: number
  createdAt: Date
}

type TransactionsCreationAttributes = Optional<TransactionsAttributes, 'id'>

export default class Transactions extends Model<TransactionsAttributes, TransactionsCreationAttributes> {
  declare id: string;
  declare debitedAccountId: string;
  declare creditedAccountId: string;
  declare value: number;
  declare createdAt: Date;
}

Transactions.init(
  {
    id: {
      type: UUID,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    debitedAccountId: {
      type: UUID,
      allowNull: false
    },
    creditedAccountId: {
      type: UUID,
      allowNull: false
    },
    value: {
      type: DECIMAL,
      allowNull: false
    },
    createdAt: {
      type: DATE,
      allowNull: false,
      defaultValue: NOW
    }
  },
  {
    sequelize: db,
    modelName: 'transactions',
    timestamps: false,
    underscored: true
  }
);

Transactions.belongsTo(Accounts, { foreignKey: 'id', as: 'debitedAccountId' });
Transactions.belongsTo(Accounts, { foreignKey: 'id', as: 'creditedAccountId' });