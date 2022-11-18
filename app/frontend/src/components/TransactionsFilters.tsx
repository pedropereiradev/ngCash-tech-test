import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack } from '@mui/material';
import React from 'react';
import { Calendar } from 'react-calendar';
import { AppContext } from '../context/AppContext';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

type TargetFiltersData = {
  target: {
    name: string
    value: string
  }
};

interface ISortBy {
  name: string
  value: string
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  minWidth: '315px',
};

function TransactionsFilters() {
  const {
    order,
    setOrder,
    clearFilters,
  } = React.useContext(AppContext);

  const [open, setOpen] = React.useState(false);
  const [dateValue, setDateValue] = React.useState(new Date());

  const SORT_BY = [{ value: 'all', name: 'Todas' }, { value: 'cash-in', name: 'Recebidas' }, { value: 'cash-out', name: 'Enviadas' }];

  const handleFiltersChange = ({ target }: TargetFiltersData) => {
    console.log(target);
    
    setOrder((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCalendar = (value: Date) => {
    const extractOnlyData = value.toISOString().split('T')[0];

    setOrder((prevState) => ({
      ...prevState,
      date: extractOnlyData,
    }));
    setOpen(false);
  };


  return (
    <>
      <Stack direction='row-reverse' spacing={2} margin={2} alignItems='center'>
        <FormControl sx={{ width: '200px' }} size='small'>
          <InputLabel id='orderByLabel'>Filtrar por</InputLabel>
          <Select
            labelId='orderByLabel'
            id='orderBy'
            name='orderBy'
            onChange={handleFiltersChange}
            label='Todas'
            value={order.orderBy}
            variant='outlined'
          >
            {SORT_BY.map((sort: ISortBy) => (
              <MenuItem value={sort.value}>{sort.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant='outlined'
          endIcon={<CalendarMonthOutlinedIcon />}
          onClick={handleOpen}
          sx={{ py: 1, px:2 }}
        >
          Data
        </Button>
        {(!order.date.length && order.orderBy === 'all')
          ? '' : <Button
        onClick={clearFilters}
        >
          Limpar filtros
        </Button>}
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Calendar
            onChange={setDateValue}
            value={dateValue}
            onClickDay={handleCalendar}
          />
        </Box>
      </Modal>
    </>
  );
}

export default TransactionsFilters;