import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { Calendar } from 'react-calendar';
import { AppContext } from '../context/AppContext';
import { getAllTransactions, getFilteredTransactions } from '../services/api';
import { IAccount, ITransaction } from '../services/interfaces';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';

type TargetFiltersData = {
  target: {
    name: string
    value: string
  }
};

function Transactions() {
  const {
    user,
    accounts,
    transactions,
    order,
    setOrder,
    setTransactions,
    clearFilters,
  } = React.useContext(AppContext);

  const [showCalendar, setShowCalendar] = React.useState(false);
  const [dateValue, setDateValue] = React.useState(new Date());

  const SORT_BY = ['cash-in', 'cash-out'];

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

  const handleFiltersChange = ({ target: { name, value } }: TargetFiltersData) => {
    setOrder((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const formatDate = (inputDate: string) => {
    const date = inputDate.split('-');
    
    return `${date[2]}/${date[1]}/${date[0]}`;
  };


  return (
    <section>
      <h2>Transações realizadas</h2>
      <section>
        <select value={order.orderBy} onChange={handleFiltersChange} name='orderBy' placeholder='Order by'>
          <option value=''>All</option>
          {SORT_BY.map((sort: string) => (
            <option value={sort}>{sort}</option>
          ))}
        </select>
        <button type='button' onClick={() => setShowCalendar((prevState) => !prevState)}>Filter by Date</button>
        {showCalendar
          && <Calendar
            onChange={setDateValue}
            value={dateValue}
            onClickDay={(value) => setOrder((prevState) => ({ ...prevState, date: value.toISOString().split('T')[0] }))}
          />
        }
        <button type='button' onClick={clearFilters}>Clear filters</button>
      </section>
      <Paper elevation={4}>
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
              <TableRow>
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