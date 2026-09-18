import { CloseOutlined } from '@ant-design/icons';
import { Alert, IconButton, Snackbar } from '@mui/material';
import { useState } from 'react';
import { Snack, SnackbarContext } from './SnackBarContext';

const SnackBarContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [snack, setSnack] = useState(new Snack({ open: false }));

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnack(new Snack({ color: snack.color, open: false }));
  };

  const action = (
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <CloseOutlined />
    </IconButton>
  );

  return (
    <SnackbarContext.Provider value={{ snack, setSnack }}>
      {/*Other components*/}
      <Snackbar
        open={snack.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={snack.autoHideDuration || 2000}
        action={action}
        onClose={handleClose}
      >
        <Alert variant="filled" severity={snack.color} onClose={handleClose}>
          {snack.message || ''}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackBarContextProvider;
