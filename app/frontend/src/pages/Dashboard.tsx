import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import { getUserAccountInfo } from '../services/api';
import { AppContext } from '../context/AppContext';
import Transactions from '../components/Transactions';
import Transfer from '../components/Transfer';
import DashboardHeader from '../components/DashboardHeader';

function Dashboard() {
  const {
    loading,
  } = React.useContext(AppContext);
    
  const navigate = useNavigate();

  React.useEffect(() => {
    async function getRenderInfo() {
      const userAccountInfo = await getUserAccountInfo();

      if (!userAccountInfo.username) return navigate('/');
    }

    getRenderInfo();
  }, []);

  return loading ? (<h1>Carregando</h1>) : (
    <>
      <DashboardHeader />
      <Transfer />
      <Transactions />
    </>
  );
}

export default Dashboard;