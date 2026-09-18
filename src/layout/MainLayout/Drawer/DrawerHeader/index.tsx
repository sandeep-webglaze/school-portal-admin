// material-ui
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import Logo from 'components/Logo';
import DrawerHeaderStyled from './DrawerHeaderStyled';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open, matchDownMD }: { open: boolean; matchDownMD: boolean }) => {
  const theme = useTheme();

  return (
    // @ts-ignore
    <DrawerHeaderStyled theme={theme} open={open as unknown as any}>
      {open ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <Logo {...{ open, matchDownMD }} />
        </Stack>
      ) : (
        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'linear-gradient(135deg,#1e4fa3,#3b6fd4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3 1 8l11 5 9-4.09V15h2V8L12 3z" fill="#d4af37" /><path d="M5 12.2V16c0 1.66 3.13 3 7 3s7-1.34 7-3v-3.8l-7 3.18-7-3.18z" fill="#fff" /></svg>
        </div>
      )}
    </DrawerHeaderStyled>
  );
};

export default DrawerHeader;
