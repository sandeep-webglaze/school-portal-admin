import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// material-ui
import { Box, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import navigation from 'menu-items';
import Drawer from './Drawer';
import Header from './Header';

import { ActionType } from 'contexts/MenuContext/MenuContext.provider';
import useMenu from 'hooks/useMenu';
import useUserContext from 'hooks/useUser';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const { isAuthenticated } = useUserContext();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menu, setMenu: dispatch } = useMenu();
  const { drawerOpen } = menu;

  // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch({ type: ActionType.OPEN_DRAWER, payload: !open });
  };

  // set media wise responsive drawer
  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch({ type: ActionType.OPEN_DRAWER, payload: !matchDownLG });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  if (isAuthenticated)
    return (
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Header open={open} handleDrawerToggle={handleDrawerToggle} />
        <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
        <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 }, overflow: 'hidden' }}>
          <Toolbar />
          <Breadcrumbs navigation={navigation} title />
          <Outlet />
        </Box>
      </Box>
    );
  else return <Navigate to="/login" />;
};

export default MainLayout;
