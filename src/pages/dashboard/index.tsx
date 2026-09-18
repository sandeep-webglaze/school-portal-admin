import { EditFilled, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
// material-ui
import { Box, Button, CardActionArea, CardMedia, Grid, Skeleton, Stack, Typography } from '@mui/material';

// project import
import { DashboardData, getDashboardDetails } from 'api/dashboard';
import MainCard from 'components/MainCard';
import useUserContext from 'hooks/useUser';
import { useNavigate } from 'react-router';
import { ROUTES } from 'routes/MainRoutes';
import { USER_ROLE } from '../../constants';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardDetails()
      .then((res) => {
        if (res.data) {
          setDashboard(res.data);
        }
      })
      .catch((err) => {
        console.error('ERROR IN GETTING Dashboard Details=>', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>

      {/* ------------------------- row 2 ------------------------- */}
      <Grid item xs={12} lg={user?.role === USER_ROLE.ADMIN ? 8 : 12}>
        <MainCard sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', xs: { flexDirection: 'column-reverse' } }}>
            <Box flex={4}>
              <Typography variant="h4" gutterBottom>
                Welcome Back!
                <Typography component="span" variant="h4" mx={1} color="primary">
                  {user?.name}
                </Typography>
              </Typography>
              <Button variant="contained" startIcon={<EditFilled />} onClick={() => navigate(ROUTES.PROFILE)}>
                Edit
              </Button>
            </Box>
            <Box sx={{ height: '120px' }}>
              <img
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center-bottom'
                }}
                width={200}
                src="https://chandi.therscc.com/project-img.png"
                alt="projectImg"
              />
            </Box>
          </Box>
        </MainCard>

        <MainCard>
          {loading ? (
            <LoadingStats />
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Stats
                  color={'rgb(36, 153, 239)'}
                  bg={'rgb(211,235,252)'}
                  text="Total Schools"
                  handleNavigate={() => navigate(ROUTES.SCHOOL.SCHOOL_LIST)}
                  stats={dashboard?.totalSchools ?? '_'}
                  icon={<UserOutlined style={{ color: 'rgb(36, 153, 239)' }} />}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <Stats
                  color={'rgb(255,49,111)'}
                  bg={'rgb(255,214,226)'}
                  text="Cities"
                  handleNavigate={() => navigate(ROUTES.LOCATIONS)}
                  stats={dashboard?.totalCities ?? '_'}
                  icon={<UserOutlined style={{ color: 'rgb(255,49,111)' }} />}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <Stats
                  color={'rgb(39, 206, 136)'}
                  bg={'rgb(212,245,231)'}
                  text="Users"
                  handleNavigate={() => navigate(ROUTES.USER.USER_LIST)}
                  stats={dashboard?.usersCount.users ?? '_'}
                  icon={<UserOutlined style={{ color: 'rgb(39, 206, 136)' }} />}
                />
              </Grid>
              {/* <Grid item xs={6} md={3}>
                  <Stats
                    color={'rgb(242 135 42)'}
                    bg={'#ffb461b0'}
                    text="Orders"
                    handleNavigate={() => navigate(ROUTES.TRANSACTIONS)}
                    stats={2}
                    icon={<UserOutlined style={{ color: 'rgb(236 123 2 / 70%)' }} />}
                  />
                </Grid> */}
            </Grid>
          )}
        </MainCard>
      </Grid>
      {user?.role === USER_ROLE.ADMIN && (
        <Grid item xs={12} lg={4}>
          {loading ? (
            <LoadingTotalEarning />
          ) : (
            <MainCard sx={{ maxWidth: 345 }}>
              <Typography textAlign="center" sx={{ color: ' #5F748D', fontWeight: '600', mb: 1 }} variant="h3">
                Total CTA Enquiries
              </Typography>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={'https://uko-react.vercel.app/static/illustration/sales-earning.svg'}
                  alt="green iguana"
                  style={{ borderRadius: '10px', objectFit: 'contain' }}
                />
              </CardActionArea>

              <Typography gutterBottom color="primary" textAlign="center" variant="h4" component="div">
                {dashboard?.totalCtaEnquiries ?? "_"}
              </Typography>
              <Button fullWidth sx={{ my: 1 }} variant="contained" onClick={() => navigate(ROUTES.TRANSACTIONS)}>
                View All CTA Enquiries
              </Button>
            </MainCard>
          )}
        </Grid>
      )}

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 3 */}
      {/* <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Top Featured Properties</Typography>
          </Grid>
          <Grid item />
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default DashboardDefault;

// @ts-ignore
const Stats = ({ color, bg, icon: Icon, text, stats, handleNavigate }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
      onClick={handleNavigate}
    >
      <Box
        sx={{
          background: bg,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          mb: 2
        }}
      >
        {Icon}
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          style={{
            fontSize: '13px',
            fontWeight: '600',
            lineHeight: '1.65',
            color: 'rgb(95, 116, 141)',
            marginBottom: '8px'
          }}
        >
          {text}
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: '24px',
            fontWeight: '600',
            color: color,
            lineHeight: '1'
          }}
        >
          {stats}
        </Typography>
      </Box>
    </Box>
  );
};

function LoadingStats() {
  return (
    <Stack direction={'row'} spacing={2}>
      {Array.from({ length: 4 }, (_, idx) => (
        <Box key={idx} width={'100%'}>
          <Skeleton variant="rectangular" sx={{ margin: 'auto', borderRadius: '8px' }} width={40} height={40} />
          <Skeleton animation="wave" sx={{ my: 1 }} />
          <Skeleton animation="wave" sx={{ my: 1 }} />
        </Box>
      ))}
    </Stack>
  );
}

function LoadingTotalEarning() {
  return (
    <MainCard>
      <Stack direction={'column'} spacing={2}>
        <Skeleton animation="wave" />
        <Box sx={{ height: 130 }}>
          <Skeleton sx={{ height: '100%', width: '100%' }} variant="rounded" animation="wave" />
        </Box>
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
      </Stack>
    </MainCard>
  );
}
