export interface ITransaction {
  debitedAccountId: string
  creditedAccountUserId: string
  value: number
}

export interface ITransactionCreateParams {
  debitedAccountId: string
  creditedAccountId: string
  value: number
}

export interface ICreditedParams {
  accountId: string
  value: number
}
