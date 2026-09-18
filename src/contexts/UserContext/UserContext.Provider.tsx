import { Grid, LinearProgress, Typography } from '@mui/material';
import { IUser, getSelfDetails } from 'api/user';
import { PLATFORM_ACCESS_ROLES } from 'constants/client';
import { getUserToken } from 'helpers';
import { useEffect, useState } from 'react';
import { UserContext } from './UserContext';

interface UserContextProviderProps {
  children: any;
}

export default function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userToken = getUserToken();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userToken) {
      getSelfDetails()
        .then((res) => {
          if (res.data && PLATFORM_ACCESS_ROLES.includes(res.data.role)) {
            setIsAuthenticated(true);
            setUser(res.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.error('err in loading user:', err);
        });
    } else setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuthenticated }}>
      {loading ? (
        <Grid container spacing={2} minHeight={'80vh'} justifyContent={'center'} direction={'column'} alignContent={'center'}>
          <Grid item xs={12} display={'flex'} flexDirection={'column'}>
            <div style={{ width: 72, height: 72, borderRadius: '16px', margin: 'auto', background: 'linear-gradient(135deg,#1e4fa3,#3b6fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 3 1 8l11 5 9-4.09V15h2V8L12 3z" fill="#d4af37" /><path d="M5 12.2V16c0 1.66 3.13 3 7 3s7-1.34 7-3v-3.8l-7 3.18-7-3.18z" fill="#fff" /></svg>
            </div>
            <Typography variant="h5" fontWeight={700} sx={{ mx: 1, my: 1 }}>
              Education{' '}
              <Typography component="span" fontSize={'inherit'} fontWeight={700} sx={{ color: '#d4af37' }}>
                Portal
              </Typography>
            </Typography>
            <LinearProgress color="primary" />
          </Grid>
        </Grid>
      ) : (
        <>{children}</>
      )}
    </UserContext.Provider>
  );
}
