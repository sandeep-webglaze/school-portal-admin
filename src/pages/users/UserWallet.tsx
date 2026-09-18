import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { IWallet, getUserWallets, updateUserWallet } from 'api/user';
import AddDialog from 'components/Dialogs/AddDialog';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import { WALLET_PAYMENT_TYPE } from 'constants/enums';
import { useFormik } from 'formik';
import useDialog from 'hooks/Dialog';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from 'routes/MainRoutes';
import * as Yup from 'yup';

const UserWallet = () => {
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUserWallet, setSelectedUserWallet] = useState<IWallet | undefined>();
  const { open, msg, setMsg, handleClose, handleOpen } = useDialog();
  const navigate = useNavigate();

  useEffect(() => {
    userWalletsList({ page: 1 });
  }, []);

  const formik = useFormik({
    initialValues: {
      type: WALLET_PAYMENT_TYPE.CREDIT,
      amount: '' as any
    },
    validationSchema: Yup.object().shape({
      amount: Yup.number().min(1).required('Amount is required')
    }),
    enableReinitialize: true,
    onSubmit: handleUpdateWallet
  });

  const handleEditClick = (wallet?: IWallet) => {
    if (wallet == null) return;
    setSelectedUserWallet(wallet);
    handleOpen();
  };

  const handleCloseAddPopup = () => {
    setSelectedUserWallet(undefined);
    handleClose();
    setMsg({ active: false, severity: '', msg: '' });
  };

  return (
    <Fragment>
      <ComonTable
        rows={wallets}
        loading={loading}
        totalRowCount={totalCount}
        onPageChange={(pagination: any) => userWalletsList({ ...pagination })}
        columns={['USER NAME', 'EMAIL', 'WALLET BALANCE', 'TRANSACTIONS', 'LAST PAYMENT', 'ACTIONS']}
      />
      <AddDialog
        open={open}
        fullScreen={false}
        title="Edit Wallet"
        subtitle="Fill Details to Update user wallet"
        handleClose={handleCloseAddPopup}
        loading={formik.isSubmitting}
        msg={msg}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(formik.errors.type)}>
                <InputLabel id="demo-multiple-checkbox-label">Select Payment Type</InputLabel>
                <Select name="type" fullWidth value={formik.values.type} onChange={formik.handleChange} label="Select Admission End Time">
                  {Object.values(WALLET_PAYMENT_TYPE).map((item, idx: number) => (
                    <MenuItem key={idx} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                {formik.errors.type && <FormHelperText>{formik.errors.type}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                type="number"
                required
                error={Boolean(formik.errors.amount)}
                helperText={formik.errors.amount}
                label="Amount"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                name="amount"
                sx={{ my: 1 }}
                value={formik.values.amount}
              />
              <Button style={{ height: '3em', margin: '10px 0px' }} fullWidth={true} size="large" type="submit" variant="contained">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </AddDialog>
    </Fragment>
  );
  function userWalletsList(query: any) {
    setLoading(true);
    getUserWallets({ ...query })
      .then((res) => {
        if (res.data) {
          setWallets(
            res.data.map((wallet: IWallet) => ({
              key: wallet._id,
              'USER NAME': wallet.user?.name,
              EMAIL: wallet.user?.mail,
              'WALLET BALANCE': wallet.amount,
              TRANSACTIONS: (
                <Button variant="contained" onClick={() => navigate(ROUTES.TRANSACTIONS, { state: { userId: wallet.user?._id } })}>
                  View Transaction
                </Button>
              ),
              'LAST PAYMENT': moment(wallet.lastPaymentAt).format('LL'),
              ACTIONS: <ActionsTool handleEdit={() => handleEditClick(wallet)} />
            }))
          );
          setTotalCount(res.totalCount as number);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
      });
  }

  async function handleUpdateWallet(values: { amount: number; type: WALLET_PAYMENT_TYPE }) {
    if (selectedUserWallet == null) return;
    let res;
    try {
      formik.resetForm();
      res = await updateUserWallet({
        user: selectedUserWallet.user._id,
        ...values
      });
      if (res.data) {
        setMsg({ active: true, severity: 'success', msg: 'Wallet updated Successfully' });
        setTimeout(() => {
          handleCloseAddPopup();
        }, 500);
        userWalletsList({ page: 1 });
      }
      return res;
    } catch (err: any) {
      console.log('err in updating user wallet', err);
      setMsg({ active: true, severity: 'error', msg: err?.error?.message ?? 'Internal Server Error' });
    }
  }
};

export default UserWallet;
