import { Tooltip, Typography } from '@mui/material';
import { IRegisterEnq, deleteSchoolEnquiry, registerSchoolEnquiries } from 'api/enquiry';
import { ErrorResponseSchema } from 'api/types';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import { Snack } from 'contexts/SnackBarContext';
import useDialog from 'hooks/Dialog';
import useSnackBarContext from 'hooks/useSnackBar';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';

const RegisterSchoolEnquiries = () => {
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEnq, setSelectedEnq] = useState<IRegisterEnq>();
  const { open, handleClose, handleOpen } = useDialog();
  const { setSnack } = useSnackBarContext();

  useEffect(() => {
    getRegisterEnquiries({ page: 1 });
  }, []);

  const handleDelete = (enquiry: IRegisterEnq) => {
    handleOpen();
    setSelectedEnq(enquiry);
  };

  return (
    <Fragment>
      <ComonTable
        rows={enquiries}
        loading={loading}
        totalRowCount={totalCount}
        onPageChange={(pagination) => getRegisterEnquiries({ ...pagination })}
        columns={['DATE', 'NAME', 'EMAIL', 'PHONE', 'SCHOOL', 'SCHOOL ADD.', 'ACTIONS']}
      />
      <ConfirmDialog open={open} handleOkay={handleOkay} handleClose={handleClose} />
    </Fragment>
  );

  function getRegisterEnquiries(query: any) {
    setLoading(true);
    registerSchoolEnquiries(query)
      .then((res) => {
        if (res.data) {
          setEnquiries(
            res.data.map((enq) => ({
              NAME: enq.name,
              EMAIL: enq.email,
              PHONE: enq.phoneNumber,
              SCHOOL: enq.school,
              'SCHOOL ADD.':
                enq.schoolAddress.length > 40 ? (
                  <Tooltip title={enq.schoolAddress}>
                    <Typography>{enq.schoolAddress.substring(0, 40) + '...'}</Typography>
                  </Tooltip>
                ) : (
                  enq.schoolAddress
                ),
              ACTIONS: <ActionsTool isDelete isEdit={false} handleDelete={() => handleDelete(enq)} />,
              DATE: moment(enq.createdAt).format('ll')
            }))
          );
          setTotalCount(res.totalCount ?? 0);
        }
      })
      .catch((err) => console.error('Err in getting Register Schook Enq list=>', err))
      .finally(() => setLoading(false));
  }

  function handleOkay() {
    if (!selectedEnq?._id) return;
    deleteSchoolEnquiry(selectedEnq?._id)
      .then((res) => {
        if (res.data) {
          getRegisterEnquiries({ page: 1 });
          setSnack(new Snack({ open: true, color: 'success', message: 'Enquiry Deleted Successfully' }));
          handleClose();
        }
      })
      .catch((err: ErrorResponseSchema) => {
        console.error('Err in deleting register enq==>', err);
        setSnack(new Snack({ open: true, color: 'error', message: err.error?.displayMessage ?? 'Something Went Wrong!' }));
      });
  }
};

export default RegisterSchoolEnquiries;
