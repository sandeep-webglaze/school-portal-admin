import { AlertColor } from '@mui/material';
import { createContext } from 'react';

class Snack {
  message?: string;
  color?: AlertColor;
  autoHideDuration?: number;
  open: boolean;

  constructor(data: Snack) {
    this.message = data.message || '';
    this.color = data.color || 'info';
    this.autoHideDuration = data.autoHideDuration || 2000;
    this.open = data.open;
  }
}

export { Snack };

type SnackDefaultValue = {
  snack: Snack;
  setSnack: React.Dispatch<React.SetStateAction<Snack>>;
};

export const SnackbarContext = createContext<SnackDefaultValue>({ snack: new Snack({ open: false }), setSnack: () => {} });
