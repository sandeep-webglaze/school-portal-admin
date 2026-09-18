import { FC, ReactNode } from 'react';

// material-ui
import { Card, CardContent, CardHeader, SxProps, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// header style
const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

interface IMainCardProps {
  border?: boolean;
  boxShadow?: boolean;
  contentSX?: SxProps;
  darkTitle?: boolean;
  elevation?: number;
  secondary?: ReactNode;
  shadow?: string | undefined;
  sx?: SxProps;
  title?: string | ReactNode; // Change this to accept string or ReactNode
  codeHighlight?: boolean;
  content?: boolean | ReactNode;
  children: ReactNode;
  handleClick?: Function;
}

export interface ITheme extends Theme {
  customShadows: {
    button: string;
    text: string;
    z1: string;
  };
}
// ==============================|| CUSTOM - MAIN CARD ||============================== //

const MainCard: FC<IMainCardProps> = ({
  border = true,
  boxShadow,
  children,
  content = true,
  contentSX = {},
  darkTitle,
  elevation,
  secondary,
  shadow,
  sx = {},
  title,
  handleClick = () => {},
  codeHighlight,
  ...others
}: IMainCardProps) => {
  const theme: ITheme = useTheme();
  boxShadow = theme.palette.mode === 'dark' ? boxShadow || true : boxShadow;

  return (
    <Card
      elevation={elevation || 0}
      // ref={ref}
      {...others}
      onClick={handleClick as any}
      sx={{
        border: border ? '1px solid' : 'none',
        // cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        borderRadius: 2,
        borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : (theme.palette.grey as unknown as any).A800,
        boxShadow: boxShadow && (!border || theme.palette.mode === 'dark') ? shadow || theme.customShadows.z1 : 'inherit',
        ':hover': {
          boxShadow: boxShadow ? shadow || theme.customShadows.z1 : 'inherit'
        },
        '& pre': {
          m: 0,
          p: '16px !important',
          fontFamily: theme.typography.fontFamily,
          fontSize: '0.75rem'
        },
        ...sx
      }}
    >
      {/* card header and action */}
      {!darkTitle && title && <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title={title} action={secondary} />}
      {darkTitle && title && <CardHeader sx={headerSX} title={<Typography variant="h3">{title}</Typography>} action={secondary} />}

      {/* card content */}
      {content && <CardContent sx={contentSX}>{children}</CardContent>}
      {!content && children}
    </Card>
  );
};

export default MainCard;
