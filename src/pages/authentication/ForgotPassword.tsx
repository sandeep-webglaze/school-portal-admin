import { Grid, Stack, Typography } from '@mui/material';
import { resetPassword } from 'api/auth';
import Logo from 'components/Logo';
import useVerifyUser from 'hooks/useVerifyUser';
import { useNavigate } from 'react-router';
import { ROUTES } from 'routes/MainRoutes';
import AuthWrapper from './AuthWrapper';
import ChangePassword from './auth-forms/ChangePassword';
import ForgotForm from './auth-forms/ForgotForm';

const ForgotPassword = () => {
  const [state, dispatch] = useVerifyUser();
  const navigate = useNavigate();
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ py: 4 }} style={{ paddingTop: 0 }} textAlign="center">
          <Logo />
        </Grid>
        <Grid item xs={12} style={{ paddingTop: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h5">{state.verify ? 'Create New Password' : 'Forgot Password'}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          {state.verify ? (
            <ChangePassword changePassword={changePassword} />
          ) : (
            <ForgotForm {...{ forgotState: state, setForgotState: dispatch }} />
          )}
        </Grid>
      </Grid>
    </AuthWrapper>
  );
  async function changePassword(password: string) {
    try {
      const res = await resetPassword({ password, token: state.token });
      console.log('res in rest', res);
      if (res.data) {
        navigate(ROUTES.LOGIN);
      }
    } catch (error) {
      console.log('error in rest password', error);
    }
  }
};

export default ForgotPassword;
