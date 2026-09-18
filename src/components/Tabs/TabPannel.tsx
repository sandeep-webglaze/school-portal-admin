import { Box } from '@mui/material';
import { Fragment } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  container?: boolean;
}

export default function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, container = false, ...other } = props;

  return (
    <div
      role="tabpanel"
      style={{ width: '100%' }}
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fragment>{container ? <Box sx={{ ml: '12px', pt: 4 }}>{children}</Box> : <Fragment>{children}</Fragment>}</Fragment>
      )}
    </div>
  );
}
