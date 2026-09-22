import { ISubscriber, deleteSubscriber, getSubscribers } from 'api/newsletter';
import { ErrorResponseSchema } from 'api/types';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import TableToolBar from 'components/Table/TableToolBar';
import { Snack } from 'contexts/SnackBarContext';
import useDialog from 'hooks/Dialog';
import useSnackBarContext from 'hooks/useSnackBar';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';

const NewsletterList = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selected, setSelected] = useState<ISubscriber>();
  const { open, handleClose, handleOpen } = useDialog();
  const { setSnack } = useSnackBarContext();

  useEffect(() => {
    list({ page: 1 });
  }, []);

  const handleDelete = (s: ISubscriber) => {
    setSelected(s);
    handleOpen();
  };

  const exportCsv = async () => {
    const res = await getSubscribers({ page: 1, limit: 100000 });
    const data = res.data || [];
    const header = 'Email,Subscribed On\n';
    const body = data
      .map((s: ISubscriber) => `${s.email},${moment(s.createdAt).format('YYYY-MM-DD')}`)
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Fragment>
      <ComonTable
        rows={rows}
        loading={loading}
        totalRowCount={totalCount}
        onPageChange={(pagination: any) => list({ ...pagination })}
        tableHeaderContent={<TableToolBar btnText="Export CSV" searchHandler={() => {}} btnClickHandler={exportCsv} />}
        columns={['DATE', 'EMAIL', 'ACTIONS']}
      />
      <ConfirmDialog open={open} handleOkay={handleOkay} handleClose={handleClose} />
    </Fragment>
  );

  function list(query: any) {
    setLoading(true);
    getSubscribers(query)
      .then((res) => {
        if (res.data) {
          setRows(
            res.data.map((s: ISubscriber) => ({
              key: s._id,
              EMAIL: s.email,
              DATE: moment(s.createdAt).format('ll'),
              ACTIONS: <ActionsTool isDelete isEdit={false} handleDelete={() => handleDelete(s)} />
            }))
          );
          setTotalCount(res.totalCount as number);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  function handleOkay() {
    if (!selected?._id) return;
    deleteSubscriber(selected._id)
      .then((res) => {
        if (res.data) {
          list({ page: 1 });
          setSnack(new Snack({ open: true, color: 'success', message: 'Subscriber removed' }));
          handleClose();
        }
      })
      .catch((err: ErrorResponseSchema) => {
        setSnack(new Snack({ open: true, color: 'error', message: err.error?.displayMessage ?? 'Something went wrong' }));
      });
  }
};

export default NewsletterList;
