export interface IAppContext {
  user: IUser
  accounts: IAccount[]
  transactions: ITransaction[]
  order: IOrder
  loading: boolean
  setTransactions: React.Dispatch<React.SetStateAction<never[]>>
  setOrder: React.Dispatch<React.SetStateAction<IOrder>>
  setUser: React.Dispatch<React.SetStateAction<IUser>>
  clearFilters: () => void
}
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