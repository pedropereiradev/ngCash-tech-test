export interface IUser {
  id: string
  balance: string
  username: string
  accountId: string
}

export interface IAccount {
  username: string
  accountId: string
}

export interface ITransaction {
  id: string
  debitedAccountId: string
  creditedAccountId: string
  createdAt: string
  transactionDate: string
  value: string
}

export interface IOrder {
  orderBy: string
  date: string
}