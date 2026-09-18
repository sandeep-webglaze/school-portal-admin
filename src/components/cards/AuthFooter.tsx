// material-ui
import { Container, Stack, Theme, Typography, useMediaQuery } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
  const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Stack direction={'row'} justifyContent={'center'} spacing={2} textAlign={'center'}>
        <Typography variant="subtitle2" color="secondary" component="span">
          &copy; Education Portal. All Rights Reserved. &nbsp;
        </Typography>
      </Stack>
    </Container>
  );
};

export default AuthFooter;
