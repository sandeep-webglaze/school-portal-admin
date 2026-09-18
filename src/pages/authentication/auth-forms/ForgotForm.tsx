import { Alert, Button, FormHelperText, Grid, InputLabel, LinearProgress, OutlinedInput, Stack, Typography } from '@mui/material';
import { sendOtpIfUserExsist, verifyOtpAndCreateSession } from 'api/auth';
import { ErrorResponseSchema } from 'api/types';
import AnimateButton from 'components/@extended/AnimateButton';
import { dark } from 'config';
import { Formik } from 'formik';
import { SignupPageAction, SignupPageState } from 'hooks/useVerifyUser';
import { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';

interface ForgotFormProps {
  forgotState: SignupPageState;
  setForgotState: React.Dispatch<SignupPageAction>;
}

interface BaseOtpData {
  mail: string;
  otp: string;
}

const formatTime = (time: number): string => {
  const minutes: string = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const seconds: string = (time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const ForgotForm: FC<ForgotFormProps> = ({ forgotState, setForgotState }) => {
  const [msg, setMsg] = useState({ active: false, severity: 'success', msg: '' });

  const handleSubmit = async (values: BaseOtpData) => {
    if (forgotState.mail && forgotState.timeout) {
      if (!values.otp) return alert('OTP is Required');
      await verifyOtpAndCreateSession({ ...values, otp: String(values.otp) })
        .then((res) => {
          if (res.data?.token) setForgotState({ type: 'verify', input: res.data?.token });
        })
        .catch((err: ErrorResponseSchema) => {
          console.log('error in verifying otp ', err);
          setMsg({ active: true, severity: 'error', msg: err?.error?.message ?? 'Server Error' });
        });
    } else await sendOtp(values);
  };

  return (
    <Formik
      initialValues={{
        mail: 'dev@web-glaze.com',
        otp: ''
      }}
      validationSchema={Yup.object().shape({
        mail: Yup.string().email('Email Must be a Email').required('Email is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          setStatus({ success: false });
          setSubmitting(true);
          await handleSubmit(values);
          setSubmitting(false);
        } catch (err: any) {
          setStatus({ success: false });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          {isSubmitting ? (
            <LinearProgress sx={{ my: 2 }} />
          ) : (
            <>
              {msg && msg.active ? (
                <Alert
                  sx={{ my: 2 }}
                  variant="filled"
                  // @ts-ignore
                  severity={msg.severity}
                >
                  {msg.msg}
                </Alert>
              ) : (
                <Typography gutterBottom color={dark.darkBlue.main}>
                  {msg.msg}
                </Typography>
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
                  disabled={Boolean(forgotState.mail && forgotState.timeout)}
                  placeholder="Enter Email"
                  fullWidth
                  // onInput={(e: any) => {
                  //   e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                  // }}
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
                <InputLabel htmlFor="phoneNumber-login">OTP</InputLabel>
                <OutlinedInput
                  id="otp-login"
                  type="number"
                  value={values.otp}
                  name="otp"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter code"
                  fullWidth
                  disabled={Boolean(!forgotState.mail)}
                  error={Boolean(touched.otp && errors.otp)}
                />
                {forgotState.mail && forgotState.timeout && (
                  <Timer
                    handleClick={async () => {
                      setSubmitting(true);
                      await sendOtp({ mail: forgotState.mail });
                      setSubmitting(false);
                    }}
                  />
                )}
                {touched.otp && errors.otp && (
                  <FormHelperText error id="standard-weight-helper-text-phoneNumber-login">
                    {errors.otp}
                  </FormHelperText>
                )}
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
  );

  async function sendOtp(body: { mail: string }) {
    await sendOtpIfUserExsist(body)
      .then((res) => {
        if (res.data && res.data.email) {
          setMsg({
            active: false,
            severity: '',
            msg: `Enter the 4 digit code that we just sent to ${res.data.email} or +91 ${res.data.email}. Code will be expire after 10 minutus`
          });
          setForgotState({ type: 'update-mail', input: res.data.email, inputTimeout: res.data.timeout as unknown as string });
        }
      })
      .catch((err) => {
        console.log('error in verifying otp ', err);
        setMsg({ active: true, severity: 'error', msg: err.error.message });
      });
  }
};

function Timer({ handleClick }: { handleClick: Function }) {
  const [time, setTime] = useState(120);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    // Check if time is equal to 0 inside the effect
    if (time === 0) {
      clearInterval(interval);
    }

    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(interval);
    };
  }, [time]);

  const handleResend = () => {
    handleClick();
    setTime(120);
  };

  return (
    <Typography
      disabled={time > 0}
      fullWidth={false}
      size="small"
      onClick={handleResend}
      color={time > 0 ? dark.darkBlue.main : 'primary'}
      component={Button}
    >
      {time > 0 ? 'Resend Code in ' + formatTime(time) : 'Resend Code'}
    </Typography>
  );
}

export default ForgotForm;
