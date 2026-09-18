import { CloseOutlined } from '@ant-design/icons';
import {
  Box,
  Checkbox,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import { ISchoolFilters, ISchoolType, getSchoolTypes } from 'api/school';
import { CommonCitySelect } from 'components/CommonFields/SelectCity';
import FormatPrice from 'components/NumericFormat';
import { forwardRef, useEffect, useState } from 'react';
import { SelectClassification } from './CommonFields/SelectClassification';
import { SelectSchoolBoards } from './CommonFields/SelectSchoolBoards';
import SelectableChips from './SelectableChips';

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
  filters: ISchoolFilters | undefined;
  setFilters: React.Dispatch<React.SetStateAction<ISchoolFilters | undefined>>;
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& + .pac-container': {
    zIndex: theme.zIndex.modal + 10000
  }
}));

const minmin = 0;
const maxmax = 100000;

export default function SchoolFilters({ open, setOpen, handleClose, handleRefresh, filters, setFilters }: FilterProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [selected, setSelected] = useState('');
  const [filterChanged, setFilterChanged] = useState(false);
  const [priceRangeValue, setPriceRangeValue] = useState([0, 80000]);
  const [schoolTypes, setSchoolTypes] = useState<ISchoolType[] | []>([]);

  useEffect(() => {
    getSchoolTypes({ limit: 100 })
      .then((res) => {
        if (res.data) setSchoolTypes(res.data);
      })
      .catch((err) => console.error('ERROR IN FETCHING USERS', err));
  }, []);

  const handlePriceRangeChange = (event: any, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const [minPrice, maxPrice] = newValue;
      setFilters((currentFilters) => ({ ...currentFilters, minPrice, maxPrice }));
    }
    setPriceRangeValue(newValue as number[]);
  };

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

  console.log('filters==>', filters);

  return (
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
            <CommonCitySelect selected={filters?.city ?? ''} handleChange={(city) => setFilters({ ...filters, city: city._id })} />
          </Grid>
          <Grid item xs={12}>
            {/* <SelectSchoolType selected={formik.values.type} handleChange={(type) => formik.setFieldValue('type', type._id, false)} /> */}
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="demo-multiple-checkbox-label">Select School Type</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                fullWidth
                value={filters?.type ?? []}
                onChange={(e) => {
                  setFilters({ ...filters, type: e.target.value as string[] });
                }}
                input={<OutlinedInput label="School Type" />}
                renderValue={(selected: string[]) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected?.map((selectVal: string) => (
                      <Chip key={selectVal} label={(schoolTypes as any[])?.find((e) => e._id === selectVal)?.name ?? ''} />
                    ))}
                  </Box>
                )}
              >
                {schoolTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    <Checkbox checked={(filters?.type ?? []).includes(type._id)} />
                    <ListItemText primary={type.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectClassification
              selected={filters?.classification ?? ''}
              handleChange={(type) => setFilters({ ...filters, classification: type._id })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectSchoolBoards
              selected={filters?.schoolBoards ?? []}
              handleChange={(borads) => setFilters({ ...filters, schoolBoards: borads })}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom variant="h4" mt={2}>
              Fees range
            </Typography>
            <Slider
              getAriaLabel={() => 'Fees range'}
              value={priceRangeValue}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => <FormatPrice price={value} />}
              min={minmin}
              max={maxmax}
            />
          </Grid>
          <Grid item xs={12}>
            <SelectableChips
              title={'Status'}
              compareKey="title"
              chips={[{ title: 'Draft' }, { title: 'Publish' }]}
              listKey="title"
              selected={filters?.published === undefined ? '' : filters?.published ? 'Publish' : 'Draft'}
              handleClick={(title: string | string[]) => {
                setFilters({ ...filters, published: title === 'Publish' });
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </CustomDialog>
  );
}
