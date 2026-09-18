import { CloseOutlined } from '@ant-design/icons';
import { Container, FormControlLabel, Grid, Switch, styled, useMediaQuery, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import { ISlugSchoolFilter } from 'api/slug';
import { forwardRef, useEffect, useState } from 'react';
import { SelectMultipleCities } from './CommonFields/SelectCity';
import { SelectMultipleClassifications } from './CommonFields/SelectClassification';
import { SelectSchoolBoards } from './CommonFields/SelectSchoolBoards';
import { SelectMultipleSchoolTypes } from './CommonFields/SelectSchoolType';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface FilterProps {
  open: boolean;
  setOpen: Function;
  handleRefresh: Function;
  handleClose: any;
  filters: ISlugSchoolFilter | undefined;
  setFilters: React.Dispatch<React.SetStateAction<ISlugSchoolFilter | undefined>>;
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& + .pac-container': {
    zIndex: theme.zIndex.modal + 10000
  }
}));

export default function Filters({ open, setOpen, handleClose, handleRefresh, filters, setFilters }: FilterProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [selected, setSelected] = useState('');
  const [filterChanged, setFilterChanged] = useState(false);

  console.log('filters==>', JSON.stringify(filters, null, 2));

  const resetFilters = () => {
    setFilters({});
  };

  // Effect to watch for changes in the filters state
  useEffect(() => {
    // Set filterChanged to true when filters change
    setFilterChanged(true);
  }, [filters]);

  const ApplyFilters = () => {
    // Check if filters exist and have changed
    if (filterChanged) {
      handleRefresh(filters);
      // Reset filterChanged to false after API call
      setFilterChanged(false);
    }
    handleClose();
  };

  return (
    <div>
      <CustomDialog fullWidth maxWidth="sm" fullScreen={fullScreen} open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar color="primary" sx={{ position: 'sticky' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseOutlined />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, fontWeight: 600 }} variant="h4" component="div">
              Apply Filters
            </Typography>
            <Button autoFocus color="inherit" onClick={resetFilters}>
              Reset
            </Button>
            <Button autoFocus color="inherit" onClick={ApplyFilters}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Grid container spacing={2} my={2}>
            <Grid item xs={12}>
              <SelectMultipleCities selected={filters?.city ?? []} handleChange={(city) => setFilters({ ...filters, city })} />
            </Grid>
            <Grid item xs={12}>
              <SelectMultipleClassifications
                selected={filters?.classification ?? []}
                handleChange={(classification) => setFilters({ ...filters, classification })}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectMultipleSchoolTypes selected={filters?.type ?? []} handleChange={(type) => setFilters({ ...filters, type })} />
            </Grid>
            <Grid item xs={12}>
              <SelectSchoolBoards
                selected={filters?.schoolBoard ?? []}
                handleChange={(board) => setFilters({ ...filters, schoolBoard: board })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters?.isHomepageSlug}
                    onChange={({ target }) => setFilters({ ...filters, isHomepageSlug: target.checked })}
                  />
                }
                label="Is Home Page Slug"
              />
            </Grid>
          </Grid>
        </Container>
        {/* <AppBar sx={{ position: 'sticky', bottom: 0, padding: 2, background: 'white' }}>
          <Button variant="contained" fullWidth>
            Save
          </Button>
        </AppBar> */}
      </CustomDialog>
    </div>
  );
}
