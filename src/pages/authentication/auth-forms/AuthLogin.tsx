import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
  Alert,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  Link,
  OutlinedInput,
  Stack
} from '@mui/material';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { authLogin } from 'api/login';
import { ErrorResponseSchema } from 'api/types';
import { PLATFORM_ACCESS_ROLES } from 'constants/client';
import { saveUserToken } from 'helpers';
import { ROUTES } from 'routes/MainRoutes';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
  const [msg, setMsg] = useState({ active: false, severity: 'success', msg: '' });

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handlLogin = async (values: { mail: string; password: string }) => {
    await authLogin(values)
      .then((res) => {
        if (res.data && !PLATFORM_ACCESS_ROLES.includes(res.data.role))
          return setMsg({ active: true, severity: 'error', msg: 'You Cannot Login in this Platform' });
        if (res.data && res.data.access_token) {
          saveUserToken(res.data.access_token);
          setMsg({ active: true, severity: 'success', msg: 'Login Completed' });
          window.location.href = '/';
          return;
        }
      })
      .catch((err: ErrorResponseSchema) => {
        console.log('err in login', err);
        setMsg({ active: true, severity: 'error', msg: err?.error?.message ?? 'Server Error' });
      });
  };

  return (
    <>
      <Formik
        initialValues={{
          mail: '',
          password: ''
        }}
        validationSchema={Yup.object().shape({
          mail: Yup.string().email('Email is not valid').required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setStatus({ success: false });
            await handlLogin(values);
            setSubmitting(false);
          } catch (err: any) {
            setStatus({ success: false });
            setErrors(err);
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            {isSubmitting ? (
              <LinearProgress sx={{ my: 2 }} />
            ) : (
              <>
                {msg && msg.active && (
                  <Alert
                    sx={{ my: 2 }}
                    variant="filled"
                    // @ts-ignore
                    severity={msg.severity}
                  >
                    {msg.msg}
                  </Alert>
                )}
              </>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="mail-login">Email</InputLabel>
                  <OutlinedInput
                    id="mail-login"
                    type="text"
                    value={values.mail}
                    name="mail"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    fullWidth
                    error={Boolean(touched.mail && errors.mail)}
                  />
                  {touched.mail && errors.mail && (
                    <FormHelperText error id="standard-weight-helper-text-mail-login">
                      {errors.mail}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
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
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
                  <Link variant="h6" component={RouterLink} to={ROUTES.FORGOT_PASSWORD} color="text.primary">
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
