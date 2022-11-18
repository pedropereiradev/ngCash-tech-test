import React from 'react';
import { useForm } from 'react-hook-form';
import { AppContext } from '../context/AppContext';
import { createTransaction, getAllTransactions, getBalance } from '../services/api';
import { IAccount, ITransaction } from '../services/interfaces';

function Transfer() {
  const {
    user,
    accounts,
    setTransactions,
    setUser,
  } = React.useContext(AppContext);

  const [showMessage, setShowMessage] = React.useState('');

  const { handleSubmit, register, formState: { errors }, reset } = useForm<ITransaction>();

  const onSubmit = handleSubmit(async (data) => {
    const transaction = await createTransaction({ value: data.value, originAccount: user.accountId, destinationAccount: data.debitedAccountId });
    if (transaction.code) return setShowMessage(transaction.response.data.message);

    setShowMessage('');

    const userBalanceResult = await getBalance();
    const userTransactions = await getAllTransactions();

    setUser((prevState) => ({
      ...prevState,
      ...userBalanceResult,
    }));
    setTransactions(userTransactions);

    reset();
  });
  return (
    <section>
      <h2>Make Transaction</h2>
      <form>
        <select {...register('debitedAccountId', { required: 'Destination account is required' })} placeholder='Destination account'>
          <option value=''>Choose an account</option>
          {accounts.map((account: IAccount) => (
            <option value={account.accountId}>{account.username}</option>
          ))}
        </select>
        <input type="number" placeholder='Value' {...register('value', { required: 'Values is required', min: 0.01 })} />
        <button
          type='submit'
          onClick={onSubmit}
        >
          Transfer
        </button>
      </form>
      <span>{showMessage}</span>
      <span>{errors.debitedAccountId?.message}</span>
      <span>{errors.value?.message}</span>
      <span>{errors.value?.type === 'min' && 'Value must be greater than 0.01'}</span>
    </section>
  );
}

export default Transfer;