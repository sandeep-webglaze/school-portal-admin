import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project import
import config from 'config';
import { ActionType } from 'contexts/MenuContext/MenuContext.provider';
import useMenu from 'hooks/useMenu';
import { FC } from 'react';
import Logo from './Logo';

// ==============================|| MAIN LOGO ||============================== //

interface LogoProps {
  sx?: any;
  to?: string;
  open?: boolean;
  matchDownMD?: boolean;
}

const LogoSection: FC<LogoProps> = ({ sx, to, ...props }) => {
  const { menu, setMenu } = useMenu();
  return (
    <ButtonBase
      disableRipple
      component={Link}
      onClick={() => setMenu({ type: ActionType.ACTIVE_ITEM, payload: [menu.defaultId] })}
      to={!to ? config.defaultPath : to}
      sx={sx}
    >
      <Logo />
    </ButtonBase>
  );
};

export default LogoSection;
