// material-ui
import { Stack, Theme, useMediaQuery } from '@mui/material';

// project import
import Profile from './Profile';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <>
      {/* {!matchesXs && <Search />} */}
      {/* {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />} */}

      {/* <IconButton
        component={Link}
        href="https://github.com/codedthemes/mantis-free-react-admin-template"
        target="_blank"
        disableRipple
        color="secondary"
        title="Download Free Version"
        sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
      >
        <GithubOutlined />
      </IconButton> */}

      <Stack direction="row" spacing={2} alignItems="center">
        {/* <Notification /> */}
        {/* {!matchesXs && } */}
        <Profile />
      </Stack>
      {/* {matchesXs && <MobileSection />} */}
    </>
  );
};

export default HeaderContent;
