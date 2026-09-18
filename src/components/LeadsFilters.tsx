import { CloseOutlined } from '@ant-design/icons';
import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import { LeadFilters } from 'api/master-leads';
import { CommonCitySelect } from 'components/CommonFields/SelectCity';
import { SelectSchoolType } from 'components/CommonFields/SelectSchoolType';
import FormatPrice from 'components/NumericFormat';
import { ENQUIRY_PLATFORMS, GENDER } from 'constants/enums';
import { forwardRef, useEffect, useState } from 'react';

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
  filters: LeadFilters | undefined;
  setFilters: React.Dispatch<React.SetStateAction<LeadFilters | undefined>>;
  showPriceRange?: boolean;
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& + .pac-container': {
    zIndex: theme.zIndex.modal + 10000
  }
}));

const minmin = 0;
const maxmax = 100000;

export default function LeadsFilters({
  open,
  setOpen,
  handleClose,
  handleRefresh,
  filters,
  setFilters,
  showPriceRange = true
}: FilterProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [filterChanged, setFilterChanged] = useState(false);
  const [priceRangeValue, setPriceRangeValue] = useState([0, 80000]);

  console.log('filters==>', JSON.stringify(filters, null, 2));

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
          {!showPriceRange && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-multiple-checkbox-label">Select Platform</InputLabel>
                <Select
                  value={filters?.platform}
                  onChange={(e: SelectChangeEvent<unknown>) => setFilters({ ...filters, platform: e.target.value as ENQUIRY_PLATFORMS })}
                  label="Select Platform"
                >
                  {Object.values(ENQUIRY_PLATFORMS).map((item, idx: number) => (
                    <MenuItem key={idx} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <CommonCitySelect selected={filters?.city ?? ''} handleChange={(city) => setFilters({ ...filters, city: city._id })} />
          </Grid>
          <Grid item xs={12}>
            <SelectSchoolType
              selected={filters?.schoolType ?? ''}
              handleChange={(type) => setFilters({ ...filters, schoolType: type._id })}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-checkbox-label">Select gender</InputLabel>
              <Select
                value={filters?.gender}
                onChange={(e: SelectChangeEvent<unknown>) => setFilters({ ...filters, gender: e.target.value as GENDER })}
                label="Select gender"
              >
                {Object.values(GENDER).map((item, idx: number) => (
                  <MenuItem key={idx} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {showPriceRange && (
            <Grid item xs={12}>
              <Typography gutterBottom variant="h4" mt={2}>
                Price range
              </Typography>
              <Slider
                getAriaLabel={() => 'Price range'}
                value={priceRangeValue}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => <FormatPrice price={value} />}
                min={minmin}
                max={maxmax}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </CustomDialog>
  );
}
