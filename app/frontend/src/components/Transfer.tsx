import { Box, Button, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Stack, Typography } from '@mui/material';
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
      <Box
        component="form"
        sx={{
          '& > :not(style)': {
            m: 1,
          },
        }}
        noValidate
        autoComplete="off"
      >
        <Stack
        sx={{
          width: { xs: '98%' },
          display: 'flex',
          flexDirection: {
            md: 'row',
            xs: 'column',
          },
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Typography
          variant='h2'
          sx={{
            fontSize: '2rem',
            color: 'text.primary',
            textAlign: {
              md: 'start',
              xs: 'center',
            },
          }}
          >
            Transferir
          </Typography>
        <FormControl sx={{
          minWidth: {
            md: '110px',
            xs: '300px',
          },
          mx: 2,
          maxWidth: '300px',
        }}>
            <InputLabel id='orderByLabel'>Destino</InputLabel>
            <Select
              labelId='orderByLabel'
              id='accountId'
              variant='outlined'
              {...register('debitedAccountId', { required: 'Destination account is required' })}
            >
              {accounts.map((account: IAccount) => (
                <MenuItem key={account.accountId} value={account.accountId}>{account.username}</MenuItem>
              ))}
            </Select>
            <FormHelperText error>
              {errors.debitedAccountId?.message}
            </FormHelperText>
          </FormControl>

        <FormControl sx={{
          minWidth: {
            md: '110px',
            xs: '300px',
          },
          maxWidth: '300px',
        }}>
            <OutlinedInput
              type="number"
              placeholder='Valor'
              startAdornment={<InputAdornment position='start'>R$</InputAdornment>}
              {...register('value', { required: 'Values is required', min: 0.01 })}
            />
            <FormHelperText error>
              {errors.debitedAccountId?.message}
            </FormHelperText>
          </FormControl>
          <Button
            variant='outlined'
            onClick={onSubmit}
            sx={{ px: 2, mx: 2, width: { xs: '300px', md: '150px' } }}
          >
            Transferir
          </Button>
          <FormHelperText error>{showMessage}</FormHelperText>
        </Stack>
      </Box>
  );
}

export default Transfer;