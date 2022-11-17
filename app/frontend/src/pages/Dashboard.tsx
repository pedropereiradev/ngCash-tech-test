import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createTransaction, getAllTransactions, getAllUsers, getBalance, getUserAccountInfo } from '../services/api';
import { logout } from '../services/userLocalStorage';

type TransactionFormData = {
  destinationAccount: string
  value: number
};

type AccountsData = {
  username: string
  accountId: string
};

type TransactionTableData = {
  id: string
  debitedAccountId: string
  creditedAccountId: string
  createdAt: string
  transactionDate: string
  value: string
};

function Dashboard() {
  const [user, setUser] = React.useState({ id: '', balance: '', username: '', accountId: '' });
  const [accounts, setAccounts] = React.useState([]);
  const [showMessage, setShowMessage] = React.useState('');
  const [transactions, setTransactions] = React.useState([]);

  const { handleSubmit, register, formState: { errors } } = useForm<TransactionFormData>();
  const navigate = useNavigate();

  React.useEffect(() => {
    async function getRenderInfo() {
      const userBalanceResult = await getBalance();
      const userAccountInfo = await getUserAccountInfo();
      const userAccounts = await getAllUsers();
      const userTransactions = await getAllTransactions();

      setUser((prevState) => ({
        ...prevState,
        ...userBalanceResult,
        ...userAccountInfo,
      }));
      setAccounts(userAccounts);
      setTransactions(userTransactions);

      console.log({ userTransactions });
      
    }

    getRenderInfo();
  }, []);

  React.useEffect(() => {
    async function getUsersAccounts() {
      const userAccounts = await getAllUsers();
      
      setAccounts(userAccounts);
    }

    getUsersAccounts();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    const transaction = await createTransaction({ value: data.value, originAccount: user.accountId, destinationAccount: data.destinationAccount });
    if (transaction.code) return setShowMessage(transaction.response.data.message);
  
    setShowMessage('');
    const userBalanceResult = await getBalance();

    setUser((prevState) => ({
      ...prevState,
      ...userBalanceResult,
    }));
  });

  const handleLogout = () => {
    logout();

    navigate('/');
  };

  const getUserFromAccount = (accountId: string):string => {
    const result = accounts.find((account: AccountsData) => account.accountId === accountId) as unknown as AccountsData;
    
    return result?.username || '';
  };

  return (
    <>
      <h1>Dashboard</h1>
      <section>
        <p>username: { user.username }</p>
        <p>balance: R${ Number(user.balance).toFixed(2).replace('.', ',') }</p>
        <button type='button' onClick={handleLogout} >Log out</button>
      </section>
      <section>
        <h2>Make Transaction</h2>
        <form>
          <select {...register('destinationAccount', { required: 'Destination account is required' })} placeholder='Destination account'>
            <option value=''>Choose an account</option>
            {accounts.map((account: AccountsData) => (
              <option value={account.accountId}>{account.username}</option>
            ))}
          </select>
          <input type="number" placeholder='Value' {...register('value', { required: 'Values is required', min: 0.01 })} />
          <button
            type='submit'
            onClick={onSubmit}
          >
            Tranfer
          </button>
        </form>
        <span>{showMessage}</span>
        <span>{errors.destinationAccount?.message}</span>
        <span>{errors.value?.message}</span>
        <span>{errors.value?.type === 'min' && 'Value must be greater than 0.01'}</span>
      </section>
      <section>
        <h2>Transactions</h2>
        <section>Filters</section>
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
            {accounts.length && transactions.map((transaction: TransactionTableData, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{Number(transaction.value).toFixed(2)}</td>
                <td>{transaction.creditedAccountId === user.accountId ? getUserFromAccount(transaction.debitedAccountId) : getUserFromAccount(transaction.creditedAccountId) }</td>
                <td>{transaction.transactionDate}</td>
                <td>{transaction.creditedAccountId === user.accountId ? 'Sent' : 'received' }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default Dashboard;