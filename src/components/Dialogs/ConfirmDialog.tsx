import { DeleteFilled } from '@ant-design/icons';
import { Avatar, Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { IProps } from './types';

interface ConfirmDialogProps extends Omit<IProps, 'title' | 'children'> {
  icon?: JSX.Element;
  text?: string;
  subText?: string;
  handleOkay?: () => void;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({ open, handleClose, icon, text, subText, handleOkay = () => {} }) => {
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth={'sm'}>
      <DialogContent>
        <Stack spacing={2} maxWidth="350px" p={1}>
          {icon || (
            <Avatar
              sx={{
                color: 'rgb(255, 69, 40)',
                backgroundColor: 'rgb(255, 231, 211)',
                width: '72px',
                height: '72px',
                margin: 'auto!important'
              }}
            >
              <DeleteFilled />
            </Avatar>
          )}
          <Typography color="textPrimary" variant="h4">
            {text || 'Are you sure you want to delete?'}
          </Typography>
          <Typography variant="h6">{subText || 'Are you sure you want to delete this item? This action cannot be undone.'}</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" fullWidth onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" fullWidth color="error" onClick={handleOkay}>
              Okay
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
