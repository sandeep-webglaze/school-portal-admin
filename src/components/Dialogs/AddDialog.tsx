import { CloseOutlined } from '@ant-design/icons';
import {
  Alert,
  AlertColor,
  Container,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Slide,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef } from 'react';
import { IProps } from './types';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddDialog: FC<IProps> = ({ open, title, subtitle, handleClose = () => {}, loading, msg, children, fullScreen }) => {
  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={smallDevice === true ? fullScreen ?? true : false}
      aria-labelledby="form-dialog-title"
      maxWidth={'sm'}
      TransitionComponent={Transition}
    >
      <DialogContent>
        <Grid container maxWidth="sm" spacing={1}>
          <Grid item xs={11} sx={{ mb: 1 }}>
            <Typography color="textPrimary" sx={{ typography: { xs: 'h5', md: 'h3' } }}>
              {title}
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {subtitle}
            </Typography>
          </Grid>
          <Grid item xs={1} alignContent={'end'}>
            <IconButton onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Grid>

          {loading && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
          {msg && msg.active && (
            <Grid item xs={12}>
              <Alert severity={msg.severity as AlertColor}>{msg.msg}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Container>{children}</Container>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AddDialog;
