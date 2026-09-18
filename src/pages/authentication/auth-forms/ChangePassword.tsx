import { Formik } from 'formik';
import * as Yup from 'yup';

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  Stack
} from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { useState } from 'react';

const ChangePassword = ({ changePassword }: { changePassword: Function }) => {
  const [msg, setMsg] = useState({ active: false, severity: 'success', msg: '' });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          password: '',
          confirmpassword: ''
        }}
        validationSchema={Yup.object({
          password: Yup.string()
            .required('Password is required')
            .min(5, 'Your password is too short.')
            .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
          confirmpassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password')], 'Passwords must match')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setStatus({ success: false });
            await changePassword(values.password);
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
                  <InputLabel htmlFor="password-login">New Password</InputLabel>
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
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Confirm New Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.confirmpassword && errors.confirmpassword)}
                    id="confirmpassword-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.confirmpassword}
                    name="confirmpassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                          edge="end"
                          size="large"
                        >
                          {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter Confirm Password"
                  />
                  {touched.confirmpassword && errors.confirmpassword && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.confirmpassword}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Submit
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

export default ChangePassword;
