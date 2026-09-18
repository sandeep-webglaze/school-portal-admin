// material-ui
import { Box, List, Typography } from '@mui/material';

// project import
import useMenu from 'hooks/useMenu';
import { FC } from 'react';
import NavItem from './NavItem';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

interface NavGroupProps {
  item: {
    title: string;
    children: any[];
  };
}

const NavGroup: FC<NavGroupProps> = ({ item }) => {
  // const menu = useSelector((state: any) => state.menu);
  const { menu } = useMenu();
  const { drawerOpen } = menu;

  const navCollapse = item.children?.map((menuItem: any) => {
    menuItem.isHidden = menuItem.isHidden ?? false;

    switch (menuItem.type) {
      case 'collapse':
        return (
          <Typography key={menuItem.id} variant="caption" color="error" sx={{ p: 2.5 }}>
            collapse - only available in paid version
          </Typography>
        );
      case 'item':
        return !menuItem.isHidden && <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
            {/* only available in paid version */}
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
};

export default NavGroup;
