// material-ui
import { Box, Typography } from '@mui/material';

// project import
import { USER_ROLE } from 'constants/enums';
import { isNotEmpty } from 'helpers';
import useUserContext from 'hooks/useUser';
import menuItem from 'menu-items';
import { Fragment } from 'react';
import NavGroup from './NavGroup';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const { user } = useUserContext();
  const navGroups = menuItem.items.map((item: any) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
