import { Chip, Typography } from '@mui/material';
import { ITransaction, getTransactions } from 'api/transactions';
import ComonTable from 'components/Table';
import { TRANSACTION_STATUS } from 'constants/enums';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUers] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { state } = useLocation();

  useEffect(() => {
    if (!state?.userId) return;
    transactionsList({ page: 1 });
  }, [state?.userId]);

  if (state?.userId)
    return (
      <Fragment>
        <Typography variant="h3">All Transactions</Typography>
        <ComonTable
          rows={users}
          loading={loading}
          totalRowCount={totalCount}
          onPageChange={(pagination: any) => transactionsList({ ...pagination })}
          columns={['DATE', 'ORDER ID', 'TSN ID', 'TYPE', 'AMOUNT', 'STATUS']}
        />
      </Fragment>
    );
  else return <></>;

  function transactionsList(query: any) {
    setLoading(true);
    getTransactions({ ...query, user: state?.userId })
      .then((res) => {
        if (res.data) {
          setUers(
            res.data.map((transaction: ITransaction) => ({
              _id: transaction._id,
              key: transaction._id,
              DATE: moment(transaction.timestamp).format('LL'),
              'ORDER ID': transaction.orderId,
              'TSN ID': transaction.transactionId,
              TYPE: transaction.type,
              DESCRIPTION: transaction.description,
              AMOUNT: transaction.amount,
              STATUS: (
                <Chip
                  label={transaction.status}
                  variant={'light' as any}
                  color={transaction.status === TRANSACTION_STATUS.FAILED ? 'error' : 'primary'}
                />
              )
            }))
          );
          setTotalCount(res.totalCount as number);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('err');
      });
  }
};

export default Transactions;
