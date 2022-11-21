import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { AppContext } from '../context/AppContext';
import { getAllTransactions, getFilteredTransactions } from '../services/api';
import { IAccount, ITransaction } from '../services/interfaces';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import TransactionsFilters from './TransactionsFilters';

function Transactions() {
  const {
    user,
    accounts,
    transactions,
    order,
    setTransactions,
  } = React.useContext(AppContext);

  React.useEffect(() => {
    async function getTransactionsWithFilters() {
      let filteredTransactions;
      if (!order.orderBy && !order.date) {
        filteredTransactions = await getAllTransactions();
      } else {
        filteredTransactions = await getFilteredTransactions(order.orderBy, order.date);
      }

      setTransactions(filteredTransactions);
    }

    getTransactionsWithFilters();
  }, [order]);

  const getUserFromAccount = (accountId: string): string => {
    const result = accounts.find((account: IAccount) => account.accountId === accountId) as unknown as IAccount;

    return result?.username || '';
  };

  const formatDate = (inputDate: string) => {
    const date = inputDate.split('-');
    
    return `${date[2]}/${date[1]}/${date[0]}`;
  };


  return (
    <section>
      <TransactionsFilters />
      <Paper elevation={4} sx={{ px: 4, m:2 }}>
        <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Conta</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Recebido/Enviado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.length && transactions.map((transaction: ITransaction, index) => (
              <TableRow key={transaction.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{`R$ ${Number(transaction.value).toFixed(2).replace('.', ',')}`}</TableCell>
                <TableCell>{transaction.creditedAccountId === user.accountId ? getUserFromAccount(transaction.debitedAccountId) : getUserFromAccount(transaction.creditedAccountId)}</TableCell>
                <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                <TableCell>
                  {transaction.creditedAccountId === user.accountId ? 'Recebido' : 'Enviado'}
                  {transaction.creditedAccountId === user.accountId ? <SouthIcon color='success' /> : <NorthIcon color='error' /> }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
    </section>
  );
}

export default Transactions;