import { getDeleteRequests } from 'api/user';
import ComonTable from 'components/Table';
import moment from 'moment';
import { useEffect, useState } from 'react';

const DeleteAccountRequest = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    deleteAccountRequests({ page: 1, limit: 10 });
  }, []);

  return (
    <ComonTable
      rows={requests}
      loading={loading}
      totalRowCount={totalCount}
      onPageChange={(pagination: any) => deleteAccountRequests({ ...pagination })}
      columns={['DATE', 'NAME', 'EMAIL', 'REASON']}
    />
  );

  function deleteAccountRequests(query: any) {
    setLoading(true);
    getDeleteRequests(query)
      .then((res) => {
        if (res.data) {
          setTotalCount(res.totalCount ?? 0);
          setRequests(
            res.data.map((req) => ({
              DATE: moment(req.createdAt).fromNow(),
              NAME: req.name,
              EMAIL: req.email,
              REASON: req.reason
            }))
          );
        }
      })
      .catch((err) => {
        console.error('Err in getting delete account requests', err);
      })
      .finally(() => setLoading(false));
  }
};

export default DeleteAccountRequest;
