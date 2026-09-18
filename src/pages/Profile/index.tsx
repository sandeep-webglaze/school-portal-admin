import { EyeInvisibleOutlined, EyeOutlined, SecurityScanOutlined, UserOutlined } from '@ant-design/icons';
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Stack,
  Typography,
  styled
} from '@mui/material';
import { ErrorResponseSchema } from 'api/types';
import { IUser, UpdateUserDto, UserProfileData, getUserProfileDetails, updateUser } from 'api/user';
import CommonUserFields from 'components/CommonFields/CommonUserFields';
import MainCard from 'components/MainCard';
import CustomTabPanel from 'components/Tabs/TabPannel';
import UserAvatar from 'components/UserAvatar';
import { Snack } from 'contexts/SnackBarContext';
import { Form, Formik, useFormik } from 'formik';
import useSnackBarContext from 'hooks/useSnackBar';
import useUserContext from 'hooks/useUser';
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { strengthColor, strengthIndicator } from 'utils';
import * as Yup from 'yup';
import { USER_ROLE } from '../../constants';

const StyledBox = styled(Box)({
  maxHeight: '70px',
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '10px',
  border: '1px solid #F2F2F7'
});

const Profile = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [profileData, setProfileData] = useState<UserProfileData>();
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const { user } = useUserContext();
  const userState: IUser = state || user;
  const { setSnack } = useSnackBarContext();
  const formik = useFormik({
    initialValues: {
      name: userState.name,
      phoneNumber: userState.phoneNumber,
      role: userState.role,
      mail: userState.mail,
      status: userState.status
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(3).max(255).required('Name is required'),
      mail: Yup.string().min(3).max(255).required('Mail is required'),
      phoneNumber: Yup.number().required('PhoneNumber is required')
    }),
    onSubmit: postData
  });

  console.log('formik==>', formik.errors);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <MainCard>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <UserAvatar />
            <Box>
              <Typography color="textPrimary" variant="h5">
                {userState.name}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {userState.role}
              </Typography>
            </Box>
          </Stack>
          <SelectedListItem
            isSelf={userState._id === user?._id}
            isAppUser={userState.role === USER_ROLE.USER}
            {...{ selectedIndex, setSelectedIndex }}
          />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={9}>
        <CustomTabPanel index={0} value={selectedIndex}>
          <MainCard>
            <Typography variant="h5" gutterBottom>
              Personal Information
            </Typography>
            <Divider />
            <Box my={2}>
              <form onSubmit={formik.handleSubmit}>
                <CommonUserFields formik={formik} />
                <Button style={{ height: '3em', margin: '10px 0px' }} fullWidth={true} size="large" type="submit" variant="contained">
                  Submit
                </Button>
              </form>
            </Box>
          </MainCard>
        </CustomTabPanel>
        {!state && (
          <CustomTabPanel value={selectedIndex} index={1}>
            <ChangePassword />
          </CustomTabPanel>
        )}
      </Grid>
    </Grid>
  );

  function getUserStats() {
    getUserProfileDetails(userState._id)
      .then((res) => {
        if (res.data) setProfileData(res.data);
      })
      .catch((err) => {
        console.log('errin profile detail', err);
      })
      .finally(() => setLoading(false));
  }

  async function postData(values: UpdateUserDto) {
    try {
      const res = await updateUser(values, userState._id);
      if (res.data) {
        setSnack(new Snack({ message: 'Profile Updated Successfully', color: 'success', open: true }));
      }
    } catch (err) {
      console.log('err in updating profile', err);
      setSnack(new Snack({ message: (err as ErrorResponseSchema)?.error?.message ?? 'Server Error', color: 'error', open: true }));
    }
  }
};

interface ListProps {
  selectedIndex: number;
  setSelectedIndex: Function;
  isSelf: boolean;
  isAppUser: boolean;
}
export function SelectedListItem({ selectedIndex, setSelectedIndex, isSelf, isAppUser }: ListProps) {
  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedIndex(index);
  };

  return (
    <List component="nav" aria-label="main mailbox folders">
      <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Personal Information" />
      </ListItemButton>
      {isSelf && (
        <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
          <ListItemIcon>
            <SecurityScanOutlined />
          </ListItemIcon>
          <ListItemText primary="Change Password" />
        </ListItemButton>
      )}
    </List>
  );
}

export function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [level, setLevel] = useState<any>();
  const { setSnack } = useSnackBarContext();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const changePassword = (value: any) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  return (
    <MainCard>
      <Typography variant="h5" gutterBottom>
        Change Password
      </Typography>
      <Divider />
      <Box my={2}>
        <Formik
          initialValues={{
            password: '',
            confirmPassword: ''
          }}
          validationSchema={Yup.object().shape({
            password: Yup.string().max(255).required('Password is required'),
            confirmPassword: Yup.string()
              .required('Confirm Password is required')
              .oneOf([Yup.ref('password')], 'Passwords must match')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              setStatus({ success: false });
              const res = await updateUser(values, '');
              if (res.data) {
                setSnack(new Snack({ message: 'Profile Updated Successfully', color: 'success', open: true }));
              }
              setSubmitting(false);
            } catch (err: any) {
              console.log('err in updating profile', err);
              setSnack(new Snack({ message: (err as ErrorResponseSchema)?.error?.message ?? 'Server Error', color: 'error', open: true }));
              setStatus({ success: false });
              // setErrors({ submit: err?.message });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <Form>
              <Stack spacing={2}>
                <InputLabel htmlFor="password-signup">New Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-signup"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="******"
                  inputProps={{}}
                />
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}

                <InputLabel htmlFor="password-signup">Confirm New Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  id="confirmPassword-signup"
                  type={showPassword ? 'text' : 'password'}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="******"
                  inputProps={{}}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.confirmPassword}
                  </FormHelperText>
                )}
                <Button fullWidth={true} type="submit" variant="contained">
                  Submit
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </MainCard>
  );
}

export default Profile;
