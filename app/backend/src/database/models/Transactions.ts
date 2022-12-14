import { DECIMAL, NOW, DATE, DATEONLY, UUID, UUIDV4, Model } from 'sequelize';
import db from '.';
import Accounts from './Accounts';

type TransactionsCreationAttributes = {
  debitedAccountId: string
  creditedAccountId: string
  value: number
};

type TransactionsAttributes = TransactionsCreationAttributes & {
  id: string,
  createdAt: Date
  transactionDate: Date
};

export default class Transactions
  extends Model<TransactionsAttributes, TransactionsCreationAttributes> {
  declare id: string;
  declare debitedAccountId: string;
  declare creditedAccountId: string;
  declare value: number;
  declare createdAt: Date;
  declare transactionDate: Date;
}

Transactions.init(
  {
    id: {
      type: UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    debitedAccountId: {
      type: UUID,
      allowNull: false,
    },
    creditedAccountId: {
      type: UUID,
      allowNull: false,
    },
    value: {
      type: DECIMAL,
      allowNull: false,
    },
    transactionDate: {
      type: DATEONLY,
      defaultValue: new Date().toISOString().split(',')[0],
    },
    createdAt: {
      type: DATE,
      defaultValue: NOW,
    },
  },
  {
    sequelize: db,
    tableName: 'transactions',
    timestamps: false,
    underscored: true,
  },
);

Transactions.belongsTo(Accounts, { foreignKey: 'debitedAccountId', as: 'debitedAccount' });
Transactions.belongsTo(Accounts, { foreignKey: 'creditedAccountId', as: 'creditedAccount' });
