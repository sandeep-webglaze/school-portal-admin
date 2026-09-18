import { ICta, deleteCta, getCtaList } from 'api/cta';
import { ErrorResponseSchema } from 'api/types';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import { Snack } from 'contexts/SnackBarContext';
import useDialog from 'hooks/Dialog';
import useSnackBarContext from 'hooks/useSnackBar';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';

const CtaList = () => {
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEnq, setSelectedEnq] = useState<ICta>();
  const { open, handleClose, handleOpen } = useDialog();
  const { setSnack } = useSnackBarContext();

  useEffect(() => {
    ctaList({ page: 1 });
  }, []);

  const handleDelete = (enquiry: ICta) => {
    handleOpen();
    setSelectedEnq(enquiry);
  };

  return (
    <Fragment>
      <ComonTable
        rows={enquiries}
        loading={loading}
        totalRowCount={totalCount}
        onPageChange={(pagination) => ctaList({ ...pagination })}
        columns={['DATE', 'NAME', 'PHONE NUMBER', 'PAGE', 'ACTIONS']}
      />
      <ConfirmDialog open={open} handleOkay={handleOkay} handleClose={handleClose} />
    </Fragment>
  );

  function ctaList(query: any) {
    setLoading(true);
    getCtaList(query)
      .then((res) => {
        if (res.data) {
          setEnquiries(
            res.data.map((enquiry) => ({
              key: enquiry._id,
              NAME: enquiry.name,
              'PHONE NUMBER': enquiry.phoneNumber,
              PAGE: enquiry.pageUrl,
              DATE: moment(enquiry.createdAt).format('ll'),
              ACTIONS: <ActionsTool isDelete isEdit={false} handleDelete={() => handleDelete(enquiry)} />
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

  function handleOkay() {
    if (!selectedEnq?._id) return;
    deleteCta(selectedEnq?._id)
      .then((res) => {
        if (res.data) {
          ctaList({ page: 1 });
          setSnack(new Snack({ open: true, color: 'success', message: 'CTA Deleted Successfully' }));
          handleClose();
        }
      })
      .catch((err: ErrorResponseSchema) => {
        console.error('Err in deleting register enq==>', err);
        setSnack(new Snack({ open: true, color: 'error', message: err.error?.displayMessage ?? 'Something Went Wrong!' }));
      });
  }
};

export default CtaList;
