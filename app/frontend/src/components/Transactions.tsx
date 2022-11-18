import React from 'react';
import { Calendar } from 'react-calendar';
import { AppContext } from '../context/AppContext';
import { getAllTransactions, getFilteredTransactions } from '../services/api';
import { IAccount, ITransaction } from '../services/interfaces';

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

  return (
    <section>
      <h2>Transactions</h2>
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
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Value</th>
            <th>Account</th>
            <th>Date</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length && transactions.map((transaction: ITransaction, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{Number(transaction.value).toFixed(2).replace('.', ',')}</td>
              <td>{transaction.creditedAccountId === user.accountId ? getUserFromAccount(transaction.debitedAccountId) : getUserFromAccount(transaction.creditedAccountId)}</td>
              <td>{transaction.transactionDate}</td>
              <td>{transaction.creditedAccountId === user.accountId ? 'Sent' : 'received'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Transactions;