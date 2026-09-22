import { EyeOutlined } from '@ant-design/icons';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Autocomplete, Avatar, Box, Button, Chip, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Tab, TextField, Tooltip, Typography } from '@mui/material';
import { ErrorResponseSchema } from 'api/types';
import { CreateUser, IUser, createNewUser, createSchoolUser, deleteUser, getUsersList, toggleVerification } from 'api/user';
import { getSchoolList } from 'api/school';
import UserImg from 'assets/images/users/userAvatar.png';
import CommonUserFields from 'components/CommonFields/CommonUserFields';
import AddDialog from 'components/Dialogs/AddDialog';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import ComonTable from 'components/Table';
import ActionsTool from 'components/Table/ActionsTool';
import TableToolBar from 'components/Table/TableToolBar';
import UserAvatar from 'components/UserAvatar';
import { Snack } from 'contexts/SnackBarContext';
import { useFormik } from 'formik';
import useDialog from 'hooks/Dialog';
import useDebounce from 'hooks/useDebounce';
import useSnackBarContext from 'hooks/useSnackBar';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { ROUTES } from 'routes/MainRoutes';
import * as Yup from 'yup';
import { SITE_DOMAIN, USER_ROLE, USER_VERIFICATION_STATUS } from '../../constants';

const UsersList = () => {
  const { open, msg, setMsg, handleClose, handleOpen } = useDialog();
  const { open: deletePopup, setOpen: setDeletePopup, handleClose: handleCloseDeletePopup, handleOpen: openDeletePopup } = useDialog();
  const [loading, setLoading] = useState(false);
  const [users, setUers] = useState<any>([]);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [search, setSearch] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [selected, setSelected] = useState<IUser>();
  const [searchParams, setSearchParams] = useSearchParams({ role: 'all' });
  const tabValue = searchParams.get('role') || 'all';
  const { setSnack } = useSnackBarContext();
  const [schools, setSchools] = useState<any[]>([]);
  const [schoolSel, setSchoolSel] = useState<any>(null);

  useEffect(() => {
    const query: any = { page: 1 };
    if (tabValue !== 'all') query.role = tabValue;
    usersList(query);
  }, [tabValue]);

  // Load schools once so a new School Admin login can be linked to one.
  useEffect(() => {
    getSchoolList({ page: 1, limit: 1000 })
      .then((res: any) => setSchools(res?.data?.schools ?? res?.data ?? []))
      .catch(() => {});
  }, []);

  const handleViewClick = (slug?: string) => {
    window.open(SITE_DOMAIN + `/school/${slug}`);
  };

  const handleEditClick = (state: IUser) => {
    navigate(ROUTES.PROFILE, { state });
  };

  const handleDeleteClick = (user: IUser) => {
    setSelected(user);
    openDeletePopup();
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      phoneNumber: '',
      mail: '',
      password: '',
      role: USER_ROLE.USER
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(3).max(255).required('Name is required'),
      password: Yup.string().min(3).max(255).required('Password is required'),
      mail: Yup.string().min(3).max(255).required('Mail is required'),
      phoneNumber: Yup.number().required('PhoneNumber is required')
    }),
    onSubmit: createUser
  });

  const checkType = (value: string) => {
    // Regular expressions for checking email, phone number, and name
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{1,4}-?[0-9]{6,}$/;
    const nameRegex = /^[A-Za-z\s]+$/;

    if (emailRegex.test(value)) {
      return { email: value };
    } else if (phoneRegex.test(value) && value.length === 10) {
      return { phoneNumber: value };
    } else if (nameRegex.test(value)) {
      return { name: value };
    }
  };

  // Call fetchData after a 1000ms debounce when inputValue changes
  useDebounce(
    () => {
      if (search != null) {
        const query = checkType(search);
        usersList(query);
      }
    },
    [search],
    1000
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ role: newValue });
  };

  return (
    <Fragment>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="All" value={'all'} />
            <Tab label="User" value={USER_ROLE.USER} />
            <Tab label="Sub Admin" value={USER_ROLE.SUB_ADMIN} />
            <Tab label="School Admin" value={USER_ROLE.SCHOOL_ADMIN} />
          </TabList>
        </Box>
        <TabPanel value={'all'}>
          <ComonTable
            rows={users}
            loading={loading}
            totalRowCount={totalCount}
            onPageChange={(pagination: any) => usersList({ ...pagination, sortBy })}
            tableHeaderContent={<TableToolBar searchHandler={(newValue: string) => setSearch(newValue)} btnClickHandler={handleOpen} />}
            columns={['DATE', 'USER NAME', 'ROLE', 'EMAIL', 'CONTACT', 'VERIFIED', 'STATUS', 'LAST LOGIN AT', 'ACTIONS']}
          />
        </TabPanel>
        <TabPanel value={USER_ROLE.USER}>
          <ComonTable
            rows={users}
            loading={loading}
            totalRowCount={totalCount}
            onPageChange={(pagination: any) => usersList({ ...pagination, role: USER_ROLE.USER })}
            tableHeaderContent={<TableToolBar searchHandler={(newValue: string) => setSearch(newValue)} btnClickHandler={handleOpen} />}
            columns={['DATE', 'USER NAME', 'EMAIL', 'CONTACT', 'STATUS', 'VERIFIED', 'LAST LOGIN AT', 'ACTIONS']}
          />
        </TabPanel>
        <TabPanel value={USER_ROLE.SUB_ADMIN}>
          <ComonTable
            rows={users}
            loading={loading}
            totalRowCount={totalCount}
            onPageChange={(pagination: any) => usersList({ ...pagination, role: USER_ROLE.SUB_ADMIN })}
            tableHeaderContent={<TableToolBar searchHandler={(newValue: string) => setSearch(newValue)} btnClickHandler={handleOpen} />}
            columns={['DATE', 'USER NAME', 'EMAIL', 'CONTACT', 'STATUS', 'VERIFIED', 'LAST LOGIN AT', 'ACTIONS']}
          />
        </TabPanel>
        <TabPanel value={USER_ROLE.SCHOOL_ADMIN}>
          <ComonTable
            rows={users}
            loading={loading}
            totalRowCount={totalCount}
            onPageChange={(pagination: any) => usersList({ ...pagination, role: USER_ROLE.SCHOOL_ADMIN })}
            tableHeaderContent={<TableToolBar searchHandler={(newValue: string) => setSearch(newValue)} btnClickHandler={handleOpen} />}
            columns={['DATE', 'USER NAME', 'EMAIL', 'CONTACT', 'STATUS', 'VERIFIED', 'SCHOOL', 'LAST LOGIN AT', 'ACTIONS']}
          />
        </TabPanel>
      </TabContext>
      <AddDialog
        open={open}
        title="Add New User"
        subtitle="Fill Details to Add User"
        handleClose={handleClose}
        loading={formik.isSubmitting}
        msg={msg}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <UserAvatar />
          </Grid>
          <Grid item xs={12} md={9}>
            <form onSubmit={formik.handleSubmit}>
              <CommonUserFields formik={formik} />
              <TextField
                variant="outlined"
                fullWidth
                required
                error={Boolean(formik.errors.password)}
                helperText={formik.errors.password}
                label="Password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                name="password"
                sx={{ my: 1 }}
                value={formik.values.password}
              />
              <FormControl fullWidth sx={{ my: 1 }}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  label="Role"
                  name="role"
                  value={formik.values.role}
                  onChange={(e) => formik.setFieldValue('role', e.target.value)}
                >
                  <MenuItem value={USER_ROLE.USER}>User</MenuItem>
                  <MenuItem value={USER_ROLE.SUB_ADMIN}>Sub Admin</MenuItem>
                  <MenuItem value={USER_ROLE.SCHOOL_ADMIN}>School Admin</MenuItem>
                </Select>
              </FormControl>
              {formik.values.role === USER_ROLE.SCHOOL_ADMIN && (
                <Autocomplete
                  options={schools}
                  getOptionLabel={(o: any) => o?.name ?? ''}
                  value={schoolSel}
                  onChange={(_e, val) => setSchoolSel(val)}
                  isOptionEqualToValue={(o: any, v: any) => o?._id === v?._id}
                  renderInput={(params) => <TextField {...params} label="Link to School" required sx={{ my: 1 }} />}
                />
              )}
              <Button style={{ height: '3em', margin: '10px 0px' }} fullWidth={true} size="large" type="submit" variant="contained">
                Submit
              </Button>
            </form>
          </Grid>
        </Grid>
      </AddDialog>
      <ConfirmDialog
        open={deletePopup}
        handleOkay={handleDelete}
        subText={`By deleting ${selected?.name} user ,will losse the access from all platforms.`}
        handleClose={handleCloseDeletePopup}
      />
    </Fragment>
  );

  async function createUser(values: CreateUser) {
    try {
      // School Admin -> create a login LINKED to the selected school.
      if (values.role === USER_ROLE.SCHOOL_ADMIN) {
        if (!schoolSel?._id) {
          setMsg({ active: true, severity: 'error', msg: 'Please select a school to link this login' });
          return;
        }
        const res = await createSchoolUser({
          name: values.name,
          mail: values.mail,
          phoneNumber: values.phoneNumber,
          password: values.password,
          school: schoolSel._id
        });
        if (res.data) {
          setMsg({ active: true, severity: 'success', msg: 'School login created successfully' });
          formik.resetForm();
          setSchoolSel(null);
          setTimeout(() => handleClose(), 600);
          usersList({ page: 1 });
        }
        return;
      }

      formik.resetForm();
      const res = await createNewUser(values);
      if (res.data) {
        setMsg({ active: true, severity: 'success', msg: 'User Created Successfully' });
        setTimeout(() => {
          handleClose();
        }, 500);
        usersList({ page: 1 });
      }
    } catch (err: any) {
      console.log('err in creating user', err);
      setMsg({ active: true, severity: 'error', msg: err?.error?.message ?? 'Internal Server Error' });
    }
  }

  function usersList(query: any) {
    setLoading(true);
    getUsersList({ ...query })
      .then((res) => {
        if (res.data) {
          setUers(
            res.data.map((user: IUser) => ({
              key: user._id,
              'USER NAME': (
                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Avatar src={user.imageUrl ?? UserImg} sizes="small" />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {user.name}
                    </Typography>
                  </Box>
                </Box>
              ),
              ROLE: user.role,
              EMAIL: user.mail,
              CONTACT: user.phoneNumber,
              VERIFIED: <Verifield user={user} refresh={() => usersList({ role: tabValue, page: 1 })} />,
              STATUS: <Chip label={user.status} variant={'light' as any} color="primary" />,
              SCHOOL: (
                <Tooltip title="View Claimed School">
                  <IconButton color="secondary" onClick={() => handleViewClick(user.school?.slug)}>
                    <EyeOutlined />
                  </IconButton>
                </Tooltip>
              ),
              DATE: moment(user.createdAt).format('ll'),
              'LAST LOGIN AT': moment(user.lastLoginAt).fromNow(),
              ACTIONS: <ActionsTool handleEdit={() => handleEditClick(user)} isDelete handleDelete={() => handleDeleteClick(user)} />
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

  function handleDelete() {
    if (!selected?._id) return;
    deleteUser(selected._id)
      .then((res) => {
        if (res.data) {
          usersList({ page: 1 });
          setSnack(new Snack({ open: true, color: 'success', message: 'User Deleted Successfully' }));
          handleCloseDeletePopup();
        }
      })
      .catch((err: ErrorResponseSchema) => {
        console.error('Err in deleting user==>', err);
        setSnack(new Snack({ open: true, color: 'error', message: err.error?.displayMessage ?? 'Something Went Wrong!' }));
      });
  }
};

export default UsersList;

interface VerifieldProps {
  user: IUser;
  refresh: Function;
}
function Verifield({ user, refresh }: VerifieldProps) {
  const [loading, setLoading] = useState(false);
  const { setSnack } = useSnackBarContext();

  function handleChangeVerify(status: USER_VERIFICATION_STATUS) {
    setLoading(true);
    toggleVerification({ userIds: [user._id], verificationStatus: status })
      .then((res) => {
        if (res.data) {
          setSnack(new Snack({ open: true, message: 'Status Changed Successfully', color: 'success' }));
          refresh();
        }
      })
      .catch((err) => {
        console.error('Err in toggleVer', err);
        setSnack(new Snack({ open: true, message: err?.error?.message ?? 'Something Went Wrong!', color: 'error' }));
      })
      .finally(() => setLoading(false));
  }

  if (user.verificationStatus === USER_VERIFICATION_STATUS.VERIFIED)
    return <Chip label={user.verificationStatus} variant={'light' as any} color="primary" />;
  else if (user.verificationStatus === USER_VERIFICATION_STATUS.REJECTED)
    return <Chip label={user.verificationStatus} variant={'light' as any} color="error" />;
  else
    return (
      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="error" disabled={loading} onClick={() => handleChangeVerify(USER_VERIFICATION_STATUS.REJECTED)}>
          Reject
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={() => handleChangeVerify(USER_VERIFICATION_STATUS.VERIFIED)}
        >
          Verify
        </Button>
      </Stack>
    );
}
